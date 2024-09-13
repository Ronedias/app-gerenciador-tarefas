import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { creatGoal } from "../../functions/create-goal";

export const createGoalRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/goals",
		{
			schema: {
				body: z.object({
					title: z.string(),
					desiredWeeklyFrequency: z.number().int().min(1).max(7),
				}),
			},
		},
		async (request) => {
			const { title, desiredWeeklyFrequency } = request.body;
			await creatGoal({
				title,
				desiredWeeklyFrequency,
			});
		},
	);
};
