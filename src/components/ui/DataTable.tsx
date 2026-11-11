"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Search } from "lucide-react";

export type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  value?: (row: T) => string | number; // used for sorting / searching
  sortable?: boolean;
  align?: "left" | "right";
};

/**
 * Sortable, searchable, paginated table. Below 768px each row becomes a labelled card,
 * so tables never force sideways scrolling on phones.
 */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  caption,
  searchPlaceholder,
  pageSize = 10,
  filters,
  empty = "No records match.",
  actions,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (r: T) => string;
  caption: string;
  searchPlaceholder?: string;
  pageSize?: number;
  filters?: ReactNode;
  empty?: string;
  actions?: (r: T) => ReactNode;
}) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);
  const [page, setPage] = useState(0);

  const val = (c: Column<T>, r: T) => (c.value ? c.value(r) : String((r as Record<string, unknown>)[c.key] ?? ""));
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let out = needle ? rows.filter((r) => columns.some((c) => String(val(c, r)).toLowerCase().includes(needle))) : rows;
    if (sort) {
      const c = columns.find((x) => x.key === sort.key)!;
      out = [...out].sort((a, b) => {
        const A = val(c, a), B = val(c, b);
        return (typeof A === "number" && typeof B === "number" ? A - B : String(A).localeCompare(String(B))) * sort.dir;
      });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, q, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages - 1);
  const slice = filtered.slice(cur * pageSize, cur * pageSize + pageSize);

  return (
    <div className="dt">
      {(searchPlaceholder || filters) && (
        <div className="dt-tools">
          {searchPlaceholder && (
            <label className="dt-search">
              <Search size={16} aria-hidden />
              <span className="sr-only">{searchPlaceholder}</span>
              <input
                className="input"
                type="search"
                placeholder={searchPlaceholder}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(0);
                }}
              />
            </label>
          )}
          {filters}
        </div>
      )}
      <div className="dt-wrap">
        <table className="dt-table">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={c.align === "right" ? "num" : undefined} aria-sort={sort?.key === c.key ? (sort.dir === 1 ? "ascending" : "descending") : undefined}>
                  {c.sortable ? (
                    <button type="button" className="dt-sort" onClick={() => setSort((s) => ({ key: c.key, dir: s?.key === c.key && s.dir === 1 ? -1 : 1 }))}>
                      {c.header}
                      {sort?.key === c.key && (sort.dir === 1 ? <ArrowUp size={14} aria-hidden /> : <ArrowDown size={14} aria-hidden />)}
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              ))}
              {actions && (
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="dt-empty">
                  {empty}
                </td>
              </tr>
            ) : (
              slice.map((r) => (
                <tr key={rowKey(r)}>
                  {columns.map((c) => (
                    <td key={c.key} data-label={c.header} className={c.align === "right" ? "num" : undefined}>
                      {c.render ? c.render(r) : String(val(c, r))}
                    </td>
                  ))}
                  {actions && <td className="dt-actions">{actions(r)}</td>}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <nav className="dt-pager" aria-label="Pagination">
          <button type="button" className="btn btn-sm btn-ghost" disabled={cur === 0} onClick={() => setPage(cur - 1)}>
            <ChevronLeft size={16} aria-hidden /> Previous
          </button>
          <span className="small muted" aria-live="polite">
            Page {cur + 1} of {pages} · {filtered.length} records
          </span>
          <button type="button" className="btn btn-sm btn-ghost" disabled={cur >= pages - 1} onClick={() => setPage(cur + 1)}>
            Next <ChevronRight size={16} aria-hidden />
          </button>
        </nav>
      )}
    </div>
  );
}
