import React, { useState } from "react";
import {
  saveRoomtypesToLocalStorage,
  getRoomtypesFromLocalStorage,
} from "../../Components/local-storage";
import {
  EditButton,
  SaveButton,
  DeleteButton,
  AddButton,
} from "../../Components/buttons";
import OutsideClickListener from "../../Components/event-listeners";

function DataTableRow({
  item,
  roomtypes,
  onEdit,
  onDelete,
  onSave,
  setRoomtypes,
}) {
  return (
    <tr className="DatatableRowOnEdit" key={item.id}>
      <td className="EditBTNBox">
        <EditButton onEdit={() => onEdit(item.id)} />
      </td>
      <td>
        {item.isEditing ? (
          <input
            className="NameBox"
            type="text"
            value={item.editedName}
            onChange={(e) => {
              const updatedRoomtypes = roomtypes.map((roomtype) =>
                roomtype.id === item.id
                  ? { ...roomtype, editedName: e.target.value }
                  : roomtype
              );
              setRoomtypes(updatedRoomtypes);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          item.roomtypeName
        )}
      </td>

      {item.isEditing && (
        <td className="SaveOrDeleteBTNBox">
          <DeleteButton onDelete={() => onDelete(item.id)} />
          <SaveButton onSave={() => onSave(item.id)} />
        </td>
      )}
    </tr>
  );
}

function DataTable({ roomtypes, onEdit, onDelete, onSave, setRoomtypes }) {
  if (!roomtypes) {
    return (
      <div className="error-message">
        Error: Roomtypes data is not available. Please try again later.
      </div>
    );
  }
  return (
    <table className="PropertyTable">
      <thead>
        <tr>
          <th></th>
          <th className="ColoumnHeadline">Name:</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {roomtypes.map((item) => (
          <DataTableRow
            item={item}
            key={item.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            roomtypes={roomtypes}
            setRoomtypes={setRoomtypes}
          />
        ))}
      </tbody>
    </table>
  );
}

export function AdminPropertyRoomtypes() {
  const [roomtypes, setRoomtypes] = useState(
    getRoomtypesFromLocalStorage() || []
  );
  const [showInput, setShowInput] = useState(false);
  const [newRoomtypeName, setNewRoomtypeName] = useState("");
  const [isAddingNewRoomtype, setIsAddingNewRoomtype] = useState(false);
  const [isEditingRoomtype, setIsEditingRoomtype] = useState(false);

  const handleAddButtonClick = () => {
    const newRoomtype = {
      id: roomtypes.length + 1,
      roomtypeName: "",
      isEditing: false,
      editedName: "",
    };

    setNewRoomtype(newRoomtype);
    setNewRoomtypeName("");
    setShowInput(true);
    setIsAddingNewRoomtype(true);
  };

  const handleAddRoomtype = () => {
    const isDuplicateName = roomtypes.some(
      (roomtype) => roomtype.roomtypeName === newRoomtypeName
    );

    if (isDuplicateName) {
      alert(
        "Roomtype with this name already exists. Please choose a new name."
      );
      return;
    }
    if (newRoomtypeName.trim() !== "") {
      const newRoomtypeToAdd = {
        id: newRoomtypeName,
        roomtypeName: newRoomtypeName,
        isEditing: false,
        editedName: "",
      };
      const updatedRoomtypes = [...roomtypes, newRoomtypeToAdd];
      setRoomtypes(updatedRoomtypes);
      saveRoomtypesToLocalStorage(updatedRoomtypes);
      setNewRoomtype({
        ...newRoomtypeToAdd,
        roomtypeName: "",
        isEditing: false,
        editedName: "",
      });
      setShowInput(false);
      setIsAddingNewRoomtype(false);
    } else {
      alert("Please enter a roomtype name.");
    }
  };

  const [newRoomtype, setNewRoomtype] = useState({
    id: roomtypes.length + 1,
    roomtypeName: newRoomtypeName,
    isEditing: false,
    editedName: "",
  });

  const handleEdit = (id) => {
    const updatedRoomtypes = roomtypes.map((item) => {
      if (item.id === id) {
        setIsEditingRoomtype(true);
        return {
          ...item,
          isEditing: !item.isEditing,
          editedName: item.roomtypeName,
        };
      }
      return item;
    });

    const editedRoomtype = updatedRoomtypes.find((item) => item.id === id);
    setNewRoomtype(editedRoomtype);

    setRoomtypes(updatedRoomtypes);
    saveRoomtypesToLocalStorage(updatedRoomtypes);
  };

  const handleSave = (id) => {
    const updatedRoomtypes = roomtypes.map((item) => {
      if (item.id === id) {
        setIsEditingRoomtype(false);
        return {
          ...item,
          isEditing: false,
          roomtypeName: item.editedName,
        };
      }
      return item;
    });

    setRoomtypes(updatedRoomtypes);
    saveRoomtypesToLocalStorage(updatedRoomtypes);
  };

  const handleDelete = (id) => {
    const updatedRoomtypes = roomtypes.filter((item) => item.id !== id);
    setRoomtypes(updatedRoomtypes);
    saveRoomtypesToLocalStorage(updatedRoomtypes);
  };
  const handleOutsideClick = () => {
    if (isAddingNewRoomtype && !isEditingRoomtype) {
      setIsAddingNewRoomtype(false);
      setShowInput(false);
    }

    if (isEditingRoomtype) {
      const updatedRoomtypes = roomtypes.map((item) => ({
        ...item,
        isEditing: false,
      }));
      setRoomtypes(updatedRoomtypes);
      setIsEditingRoomtype(false);
    }
  };

  return (
    <div className="PropertyContainer">
      <OutsideClickListener onOutsideClick={handleOutsideClick}>
        <div className="PropertyContent">
          <h1>ROOMTYPES</h1>
          <DataTable
            roomtypes={roomtypes}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            setRoomtypes={setRoomtypes}
            isAddingNewSRoomtype={isAddingNewRoomtype}
            isEditingRoomtype={isEditingRoomtype}
            handleOutsideClick={handleOutsideClick}
            newRoomtype={newRoomtype}
          />
          {!showInput && <AddButton onAdd={handleAddButtonClick} />}
          {showInput && (
            <div className="AddContent">
              <input
                className="NameBox"
                type="text"
                value={newRoomtypeName}
                onChange={(e) => setNewRoomtypeName(e.target.value)}
                placeholder="Enter roomtype name"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingNewRoomtype(true);
                }}
                onFocus={(e) => e.stopPropagation()}
              />
              <SaveButton onSave={handleAddRoomtype} />
            </div>
          )}
        </div>
      </OutsideClickListener>
    </div>
  );
}
