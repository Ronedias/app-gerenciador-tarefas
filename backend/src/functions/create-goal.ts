import { db } from "../db";
import { goals } from "../db/schema";

interface CreatGoalRequest {
	title: string;
	desiredWeeklyFrequency: number;
}

export async function creatGoal({
	title,
	desiredWeeklyFrequency,
}: CreatGoalRequest) {
	const result = await db
		.insert(goals)
		.values({
			title,
			desiredWeeklyFrequency,
		})
		.returning();

	const goal = result[0];

	return {
		goal,
	};
}
