import React from 'react';

// ============================================
// TABLE COMPONENTS
// ============================================

const Table = React.forwardRef(({ 
  children, 
  style = {},
  ...props 
}, ref) => (
  <div style={{ width: '100%', overflowX: 'auto' }}>
    <table
      ref={ref}
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '14px',
        ...style,
      }}
      {...props}
    >
      {children}
    </table>
  </div>
));

Table.displayName = 'Table';

const TableHeader = React.forwardRef(({ 
  children, 
  style = {},
  ...props 
}, ref) => (
  <thead
    ref={ref}
    style={{
      borderBottom: '1px solid var(--border)',
      ...style,
    }}
    {...props}
  >
    {children}
  </thead>
));

TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef(({ 
  children, 
  style = {},
  ...props 
}, ref) => (
  <tbody
    ref={ref}
    style={style}
    {...props}
  >
    {children}
  </tbody>
));

TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef(({ 
  children, 
  style = {},
  ...props 
}, ref) => (
  <tfoot
    ref={ref}
    style={{
      borderTop: '1px solid var(--border)',
      backgroundColor: 'var(--muted)',
      fontWeight: '500',
      ...style,
    }}
    {...props}
  >
    {children}
  </tfoot>
));

TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef(({ 
  children, 
  hoverable = true,
  clickable = false,
  selected = false,
  style = {},
  ...props 
}, ref) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <tr
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        borderBottom: '1px solid var(--border)',
        backgroundColor: selected 
          ? 'var(--muted)' 
          : (hoverable && isHovered) 
            ? 'var(--muted)' 
            : 'transparent',
        cursor: clickable ? 'pointer' : 'default',
        transition: 'background-color 0.15s ease',
        ...style,
      }}
      {...props}
    >
      {children}
    </tr>
  );
});

TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef(({ 
  children, 
  align = 'left',
  style = {},
  ...props 
}, ref) => (
  <th
    ref={ref}
    style={{
      padding: '12px 16px',
      textAlign: align,
      fontSize: '12px',
      fontWeight: '600',
      color: 'var(--muted-foreground)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      whiteSpace: 'nowrap',
      ...style,
    }}
    {...props}
  >
    {children}
  </th>
));

TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef(({ 
  children, 
  align = 'left',
  style = {},
  ...props 
}, ref) => (
  <td
    ref={ref}
    style={{
      padding: '12px 16px',
      textAlign: align,
      color: 'var(--foreground)',
      verticalAlign: 'middle',
      ...style,
    }}
    {...props}
  >
    {children}
  </td>
));

TableCell.displayName = 'TableCell';

// ============================================
// TABLE CAPTION
// ============================================

const TableCaption = React.forwardRef(({ 
  children, 
  style = {},
  ...props 
}, ref) => (
  <caption
    ref={ref}
    style={{
      marginTop: '16px',
      fontSize: '14px',
      color: 'var(--muted-foreground)',
      ...style,
    }}
    {...props}
  >
    {children}
  </caption>
));

TableCaption.displayName = 'TableCaption';

// ============================================
// DATA TABLE (Convenience wrapper)
// ============================================

const DataTable = ({
  columns, // [{ key, header, align, render, width }]
  data,
  onRowClick,
  onRowDoubleClick,
  emptyState,
  loading = false,
  style = {},
  ...props
}) => {
  if (loading) {
    return (
      <div style={{ 
        padding: '48px', 
        textAlign: 'center',
        color: 'var(--muted-foreground)',
      }}>
        <svg 
          style={{ 
            width: '32px', 
            height: '32px', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto',
          }} 
          viewBox="0 0 24 24" 
          fill="none"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="12" />
        </svg>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return emptyState || (
      <div style={{ 
        padding: '48px', 
        textAlign: 'center',
        color: 'var(--muted-foreground)',
      }}>
        No data available
      </div>
    );
  }

  return (
    <Table style={style} {...props}>
      <TableHeader>
        <TableRow hoverable={false}>
          {columns.map((col) => (
            <TableHead 
              key={col.key} 
              align={col.align}
              style={{ width: col.width }}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={row.id || rowIndex}
            clickable={!!onRowClick || !!onRowDoubleClick}
            onClick={() => onRowClick?.(row)}
            onDoubleClick={() => onRowDoubleClick?.(row)}
          >
            {columns.map((col) => (
              <TableCell key={col.key} align={col.align}>
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export { 
  Table, 
  TableHeader, 
  TableBody, 
  TableFooter, 
  TableRow, 
  TableHead, 
  TableCell, 
  TableCaption,
  DataTable,
};
