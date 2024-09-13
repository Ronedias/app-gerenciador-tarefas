import fastify from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";

import { createGoalRoute } from "./routes/create-goal";
import { pendingGoalRoute } from "./routes/get-pending-goals";
import { createCompletionRoute } from "./routes/create-completion";
import { getWeekSummaryRoute } from "./routes/get-week-summary";
import fastifyCors from "@fastify/cors";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
	origin: "*",
});

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute);
app.register(pendingGoalRoute);
app.register(createCompletionRoute);
app.register(getWeekSummaryRoute);

app
	.listen({
		port: 3333,
	})
	.then(() => {
		console.log("HTTP server is running");
	});
