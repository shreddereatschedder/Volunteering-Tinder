import { CardStack } from "./components/card-stack";
import { volunteerOpportunities } from "./data";

export default function Home() {
  return <CardStack opportunities={volunteerOpportunities} />;
}
