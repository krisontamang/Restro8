import React from 'react';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  striped?: boolean;
  hoverable?: boolean;
  dense?: boolean;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      striped = false,
      hoverable = true,
      dense = false,
      containerClassName = '',
      containerStyle,
      className = '',
      style,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`r8-table-container responsive-table-container ${containerClassName}`}
        style={{
          width: '100%',
          overflowX: 'auto',
          backgroundColor: 'var(--r8-bg-surface)',
          border: '1px solid var(--r8-border-subtle)',
          borderRadius: 'var(--r8-radius-md)',
          boxSizing: 'border-box',
          WebkitOverflowScrolling: 'touch',
          ...containerStyle,
        }}
      >
        <table
          ref={ref}
          className={`r8-table ${className}`}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: dense ? '0.8rem' : '0.875rem',
            textAlign: 'left',
            ...style,
          }}
          {...props}
        >
          {children}
        </table>
      </div>
    );
  }
);

Table.displayName = 'Table';

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <thead
    className={`r8-table-header ${className}`}
    style={{
      backgroundColor: 'var(--r8-bg-subtle)',
      borderBottom: '1px solid var(--r8-border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 2,
      ...style,
    }}
    {...props}
  >
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <tbody className={`r8-table-body ${className}`} style={{ ...style }} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({
  className = '',
  style,
  children,
  ...props
}) => (
  <tr
    className={`r8-table-row ${className}`}
    style={{
      borderBottom: '1px solid var(--r8-border-subtle)',
      transition: 'background-color var(--r8-motion-fast)',
      ...style,
    }}
    {...props}
  >
    {children}
  </tr>
);

export interface TableHeadCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
}

export const TableHeadCell: React.FC<TableHeadCellProps> = ({
  align,
  numeric = false,
  className = '',
  style,
  children,
  ...props
}) => {
  const effectiveAlign = align || (numeric ? 'right' : 'left');
  return (
    <th
      scope="col"
      className={`r8-table-th ${numeric ? 'r8-tabular-num' : ''} ${className}`}
      style={{
        padding: '10px 14px',
        fontWeight: 600,
        fontSize: '0.78rem',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        color: 'var(--r8-text-secondary)',
        textAlign: effectiveAlign,
        whiteSpace: 'nowrap',
        ...style,
      }}
      {...props}
    >
      {children}
    </th>
  );
};

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'center' | 'right';
  numeric?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({
  align,
  numeric = false,
  className = '',
  style,
  children,
  ...props
}) => {
  const effectiveAlign = align || (numeric ? 'right' : 'left');
  return (
    <td
      className={`r8-table-td ${numeric ? 'r8-tabular-num' : ''} ${className}`}
      style={{
        padding: '12px 14px',
        color: 'var(--r8-text-primary)',
        textAlign: effectiveAlign,
        ...style,
      }}
      {...props}
    >
      {children}
    </td>
  );
};
