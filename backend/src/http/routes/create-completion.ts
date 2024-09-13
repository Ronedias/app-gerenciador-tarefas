import { z } from "zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { creatGoalCompletion } from "../../functions/create-goal-completions";

export const createCompletionRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/completions",
		{
			schema: {
				body: z.object({
					goalId: z.string(),
				}),
			},
		},
		async (request) => {
			const { goalId } = request.body;

			await creatGoalCompletion({
				goalId,
			});
		},
	);
};
