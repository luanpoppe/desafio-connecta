import { type KeyboardEvent } from "react";
import {
  Avatar,
  ResponsiveDataTable,
  type ResponsiveDataColumn,
  TableRow,
  TableTd,
} from "@connecta/design-system";
import type { UserDto } from "../../../api/@types/user.types";

const CUSTOMER_LIST_COLUMNS: ResponsiveDataColumn<UserDto>[] = [
  {
    id: "name",
    header: "Cliente",
    cell: (user) => {
      const name = `${user.firstName} ${user.lastName}`.trim();
      return (
        <span className="flex items-center gap-3 min-w-0">
          <Avatar src={user.image} name={name} size="sm" />
          <span className="truncate font-medium">{name}</span>
        </span>
      );
    },
    className: "whitespace-normal min-w-0 max-w-[200px]",
  },
  {
    id: "email",
    header: "E-mail",
    cell: (user) => user.email,
    muted: true,
    className: "max-w-[180px] truncate",
  },
  {
    id: "phone",
    header: "Telefone",
    cell: (user) => user.phone,
    muted: true,
  },
  {
    id: "id",
    header: "ID",
    cell: (user) => user.id,
    align: "right",
    muted: true,
  },
];

export function CustomerListRow({
  user,
  selected,
  onSelect,
}: {
  user: UserDto;
  selected: boolean;
  onSelect: (id: number) => void;
}) {
  const name = `${user.firstName} ${user.lastName}`.trim();
  return (
    <TableRow
      interactive
      selected={selected}
      onClick={() => onSelect(user.id)}
      onKeyDown={(e: KeyboardEvent<HTMLTableRowElement>) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(user.id);
        }
      }}
      tabIndex={0}
      aria-selected={selected}
    >
      <TableTd className="whitespace-normal min-w-0 max-w-[200px]">
        <span className="flex items-center gap-3 min-w-0">
          <Avatar src={user.image} name={name} size="sm" />
          <span className="truncate font-medium">{name}</span>
        </span>
      </TableTd>
      <TableTd muted className="max-w-[180px] truncate">
        {user.email}
      </TableTd>
      <TableTd muted>{user.phone}</TableTd>
      <TableTd align="right" muted>
        {user.id}
      </TableTd>
    </TableRow>
  );
}

export function CustomersListTable({
  items,
  selectedUserId,
  onSelectUser,
}: {
  items: UserDto[];
  selectedUserId: number | null;
  onSelectUser: (id: number) => void;
}) {
  return (
    <ResponsiveDataTable
      rows={items}
      columns={CUSTOMER_LIST_COLUMNS}
      getRowKey={(u) => u.id}
      rowInteraction={{
        type: "select",
        selectedKey: selectedUserId,
        onSelect: (u) => onSelectUser(u.id),
        listboxAriaLabel: "Clientes",
      }}
    />
  );
}
