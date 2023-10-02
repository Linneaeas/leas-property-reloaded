import React from "react";

export default function LogoutButton({ Logout }) {
  return (
    <div>
      <button className="LogoutBTN" id="LogoutButton" onClick={Logout}>
        LOG OUT
      </button>
    </div>
  );
}

export function AddButton({ onAdd }) {
  return (
    <div>
      <button className="AddBTN" id="AddButton" onClick={onAdd}></button>
    </div>
  );
}

export function EditButton({ onEdit }) {
  return (
    <div>
      <button className="EditBTN" id="EditButton" onClick={onEdit}></button>
    </div>
  );
}

export function SaveButton({ onSave }) {
  return (
    <div>
      <button className="SaveBTN" id="SaveButton" onClick={onSave}></button>
    </div>
  );
}

export function DeleteButton({ onDelete }) {
  const handleDelete = () => {
    if (
      window.confirm(
        "This action is non-reversible! Are you sure you want to delete this item?"
      )
    ) {
      onDelete();
    }
  };

  return (
    <div>
      <button
        className="DeleteBTN"
        id="DeleteButton"
        onClick={handleDelete}
      ></button>
    </div>
  );
}
