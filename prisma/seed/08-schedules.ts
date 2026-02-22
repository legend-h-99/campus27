// =============================================================================
// Campus26 Seed: Schedules
// Links trainers to courses with weekly time slots for the current semester
// =============================================================================

import type { PrismaClient } from "@prisma/client";
import { randomFrom, randomInt, shuffleArray } from "./helpers";
import { TIME_SLOTS, DAYS_OF_WEEK } from "./00-config";

/**
 * Room pool per department prefix.
 * Technical departments get lab rooms; others get standard classrooms.
 */
const BUILDING_ROOMS: Record<string, string[]> = {
  "dept-cs": ["A-101", "A-102", "A-103", "A-201", "A-202", "LAB-CS-01", "LAB-CS-02", "LAB-CS-03"],
  "dept-ee": ["B-101", "B-102", "B-103", "B-201", "LAB-EE-01", "LAB-EE-02"],
  "dept-me": ["B-301", "B-302", "B-303", "LAB-ME-01", "LAB-ME-02", "LAB-ME-03"],
  "dept-ba": ["C-101", "C-102", "C-103", "C-201", "C-202"],
  "dept-em": ["C-301", "C-302", "C-303"],
  "dept-wd": ["A-301", "A-302", "LAB-WD-01", "LAB-WD-02"],
  "dept-cy": ["A-401", "A-402", "LAB-CY-01", "LAB-CY-02"],
  "dept-gd": ["D-101", "D-102", "LAB-GD-01", "LAB-GD-02"],
  "dept-ac": ["C-401", "C-402", "C-403"],
  "dept-os": ["E-101", "E-102", "LAB-OS-01"],
};

/** Default rooms when department is not found in the map */
const DEFAULT_ROOMS = ["F-101", "F-102", "F-103", "F-201"];

export async function seedSchedules(
  prisma: PrismaClient,
  trainers: any[],
  courses: any[],
  semesterId: string
) {
  console.log("  Seeding schedules...");

  const schedules: any[] = [];

  // Track used slots per trainer: trainerId -> Set<"DAY-SLOTINDEX">
  const trainerUsedSlots = new Map<string, Set<string>>();

  // Track used room slots: "ROOM-DAY-SLOTINDEX" to prevent room conflicts
  const roomUsedSlots = new Set<string>();

  // Track how many courses each trainer teaches
  const trainerCourseCount = new Map<string, number>();

  // Group trainers by department for matching
  const trainersByDept = new Map<string, any[]>();
  for (const trainer of trainers) {
    const deptId = trainer.departmentId;
    if (!trainersByDept.has(deptId)) {
      trainersByDept.set(deptId, []);
    }
    trainersByDept.get(deptId)!.push(trainer);
    trainerUsedSlots.set(trainer.id, new Set());
    trainerCourseCount.set(trainer.id, 0);
  }

  // Shuffle courses for variety
  const shuffledCourses = shuffleArray([...courses]);

  for (const course of shuffledCourses) {
    const deptId = course.departmentId;
    const deptTrainers = trainersByDept.get(deptId);

    if (!deptTrainers || deptTrainers.length === 0) {
      continue; // Skip courses with no available trainers in the department
    }

    // Find a trainer in the same department who hasn't exceeded the course limit (4-6)
    // Prefer trainers with fewer courses assigned
    const availableTrainers = shuffleArray(
      deptTrainers.filter((t: any) => (trainerCourseCount.get(t.id) ?? 0) < 6)
    );

    if (availableTrainers.length === 0) {
      continue; // All trainers at max capacity
    }

    // Sort by current course count (ascending) to balance load
    availableTrainers.sort(
      (a: any, b: any) =>
        (trainerCourseCount.get(a.id) ?? 0) - (trainerCourseCount.get(b.id) ?? 0)
    );

    const trainer = availableTrainers[0];
    const trainerId = trainer.id;
    const usedSlots = trainerUsedSlots.get(trainerId)!;

    // Determine how many slots this course gets (2-3 per week)
    const slotsNeeded = randomInt(2, 3);
    const rooms = BUILDING_ROOMS[deptId] || DEFAULT_ROOMS;

    // Try to find non-conflicting day+time combinations
    const allPossibleSlots: { day: string; slotIdx: number }[] = [];
    for (const day of DAYS_OF_WEEK) {
      for (let slotIdx = 0; slotIdx < TIME_SLOTS.length; slotIdx++) {
        allPossibleSlots.push({ day, slotIdx });
      }
    }

    const shuffledSlots = shuffleArray(allPossibleSlots);
    let assignedCount = 0;

    for (const slot of shuffledSlots) {
      if (assignedCount >= slotsNeeded) break;

      const slotKey = `${slot.day}-${slot.slotIdx}`;

      // Check trainer conflict
      if (usedSlots.has(slotKey)) continue;

      // Pick a room and check room conflict
      const room = randomFrom(rooms);
      const roomSlotKey = `${room}-${slot.day}-${slot.slotIdx}`;
      if (roomUsedSlots.has(roomSlotKey)) {
        // Try other rooms
        let foundRoom: string | null = null;
        for (const altRoom of shuffleArray([...rooms])) {
          const altKey = `${altRoom}-${slot.day}-${slot.slotIdx}`;
          if (!roomUsedSlots.has(altKey)) {
            foundRoom = altRoom;
            break;
          }
        }
        if (!foundRoom) continue; // No room available at this slot

        const timeSlot = TIME_SLOTS[slot.slotIdx];

        const schedule = await prisma.schedule.create({
          data: {
            courseId: course.id,
            trainerId,
            semesterId,
            dayOfWeek: slot.day as any,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            room: foundRoom,
            isActive: true,
          },
        });

        schedules.push(schedule);
        usedSlots.add(slotKey);
        roomUsedSlots.add(`${foundRoom}-${slot.day}-${slot.slotIdx}`);
        assignedCount++;
      } else {
        const timeSlot = TIME_SLOTS[slot.slotIdx];

        const schedule = await prisma.schedule.create({
          data: {
            courseId: course.id,
            trainerId,
            semesterId,
            dayOfWeek: slot.day as any,
            startTime: timeSlot.start,
            endTime: timeSlot.end,
            room,
            isActive: true,
          },
        });

        schedules.push(schedule);
        usedSlots.add(slotKey);
        roomUsedSlots.add(roomSlotKey);
        assignedCount++;
      }
    }

    if (assignedCount > 0) {
      trainerCourseCount.set(
        trainerId,
        (trainerCourseCount.get(trainerId) ?? 0) + 1
      );
    }
  }

  console.log(`  Created ${schedules.length} schedule slots.`);

  return schedules;
}
