import { S } from "../constants/styles";

export default function Select({ value, onChange, options, style }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...S.select, ...style }}
    >
      <option value="">Select...</option>
      {options.map((o) => {
        if (typeof o === "string") {
          return (
            <option key={o} value={o}>
              {o}
            </option>
          );
        }

        return (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        );
      })}
    </select>
  );
}