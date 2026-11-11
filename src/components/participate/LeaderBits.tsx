import { formatNaira } from "@/lib/format";

/** Launch rate card for field tasks (PRD §21 decision 3), reviewed every two weeks. */
export const RATE_CARD = [
  { task: "Flier drop", unit: "per 100 fliers", rate: 500 },
  { task: "Poster run", unit: "per 20 posters", rate: 1000 },
  { task: "Door-to-door outreach", unit: "per 4-hour shift", rate: 1500 },
  { task: "Merch distribution", unit: "per 20 items", rate: 500 },
  { task: "Village meeting host", unit: "per meeting", rate: 5000 },
];

export function RateCard() {
  return (
    <table className="rate-table">
      <caption className="sr-only">Launch rate card for field tasks</caption>
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Unit</th>
          <th scope="col" className="num">
            Rate
          </th>
        </tr>
      </thead>
      <tbody>
        {RATE_CARD.map((r) => (
          <tr key={r.task}>
            <td>{r.task}</td>
            <td>{r.unit}</td>
            <td className="num">{formatNaira(r.rate)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
