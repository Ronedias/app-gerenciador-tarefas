import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { db } from "../db";
import { goalCompletions, goals } from "../db/schema";
import dayjs from "dayjs";

export async function getWeekSummary() {
	const firstDayOfWeek = dayjs().startOf("week").toDate();
	const lastDayOfWeek = dayjs().endOf("week").toDate();

	const goalsCreatUpToWeek = db.$with("goals_created_up_to_week").as(
		db
			.select({
				id: goals.id,
				title: goals.title,
				desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
				creatAt: goals.createdAt,
			})
			.from(goals)
			.where(lte(goals.createdAt, lastDayOfWeek)),
	);

	const goalsCompletedInWeek = db.$with("goals_completed__in_week").as(
		db
			.select({
				id: goalCompletions.id,
				title: goals.title,
				completedAt: goalCompletions.createdAt,
				completedAtDate: sql /*sql*/`
					DATE(${goalCompletions.createdAt})
				`.as("completedAtDate"),
			})
			.from(goalCompletions)
			.innerJoin(goals, eq(goals.id, goalCompletions.goalId))
			.where(
				and(
					gte(goalCompletions.createdAt, firstDayOfWeek),
					lte(goalCompletions.createdAt, lastDayOfWeek),
				),
			),
	);

	const goalsCompletedbyWeekDay = db.$with("goals_completed_by_week_day").as(
		db
			.select({
				completedAtDate: goalsCompletedInWeek.completedAtDate,
				completions: sql /*sql*/`
				 JSON_AGG(
					JSON_BUILD_OBJECT(
						'id', ${goalsCompletedInWeek.id},
						'title', ${goalsCompletedInWeek.title},
						'completedAt', ${goalsCompletedInWeek.completedAt}
					)
				 )
				 `.as("completions"),
			})
			.from(goalsCompletedInWeek)
			.groupBy(goalsCompletedInWeek.completedAtDate),
	);

	const result = await db
		.with(goalsCreatUpToWeek, goalsCompletedInWeek, goalsCompletedbyWeekDay)
		.select({
			completed:
				sql /*sql*/`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
					Number,
				),
			total:
				sql /*sql*/`(SELECT SUM(${goalsCreatUpToWeek.desiredWeeklyFrequency}) FROM ${goalsCreatUpToWeek})`.mapWith(
					Number,
				),
			goalsPerDay: sql /*sql*/`
				JSON_OBJECT_AGG(
					${goalsCompletedbyWeekDay.completedAtDate},
					${goalsCompletedbyWeekDay.completions}
				)`,
		})
		.from(goalsCompletedbyWeekDay);

	return {
		summary: result,
	};
}
