import { type KeyboardEvent } from "react";
import {
  Avatar,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableTd,
  TableTh,
} from "@connecta/design-system";
import type { UserDto } from "../../../api/@types/user.types";

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
    <Table>
      <TableHead>
        <TableRow>
          <TableTh>Cliente</TableTh>
          <TableTh>E-mail</TableTh>
          <TableTh>Telefone</TableTh>
          <TableTh align="right">ID</TableTh>
        </TableRow>
      </TableHead>
      <TableBody>
        {items.map((u) => (
          <CustomerListRow
            key={u.id}
            user={u}
            selected={selectedUserId === u.id}
            onSelect={onSelectUser}
          />
        ))}
      </TableBody>
    </Table>
  );
}
