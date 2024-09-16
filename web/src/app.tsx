import { Dialog } from "./components/ui/dialog";
import { CreateGoal } from "./components/create-goal";
import { Summary } from "./components/summary";
// import { EmpptyGoals } from "./components/empty-goals";

export function App() {
	return (
		<Dialog>
			{/* <EmpptyGoals /> */}
			<Summary />
			<CreateGoal />
		</Dialog>
	);
}
