import { client, db } from ".";
import { goalCompletions, goals } from "./schema";
import dayjs from "dayjs";

async function seed() {
	await db.delete(goalCompletions);
	await db.delete(goals);

	const result = await db
		.insert(goals)
		.values([
			{ title: "Acordar cedo", desiredWeeklyFrequency: 5 },
			{ title: "Estudar", desiredWeeklyFrequency: 5 },
			{ title: "Me exercitar", desiredWeeklyFrequency: 3 },
			{ title: "Meditar", desiredWeeklyFrequency: 1 },
		])
		.returning();

	// Importa a biblioteca Day.js, que é uma biblioteca leve para manipulação de datas.
	// startOf() retorna um objeto dayjs que representa o primeiro dia da semana (por padrão, domingo).
	const startOfWeek = dayjs().startOf("week");

	// Insere registros de conclusão de metas no banco de dados
	await db.insert(goalCompletions).values([
		// Cria um registro para a primeira meta, usando o ID da meta e a data do início da semana atual.
		{ goalId: result[0].id, createdAt: startOfWeek.toDate() },

		// Cria um registro para a segunda meta, usando o ID da meta e a data do dia seguinte ao início da semana.
		// createdAt é definida como um dia após o início da semana.
		{ goalId: result[1].id, createdAt: startOfWeek.add(1, "day").toDate() },
	]);
}

seed().finally(() => {
	client.end();
});
