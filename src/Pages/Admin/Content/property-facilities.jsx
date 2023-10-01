import React, { useState } from "react";
import {
  saveFacilitiesToLocalStorage,
  getFacilitiesFromLocalStorage,
} from "../../../Components/local-storage";
import {
  EditButton,
  SaveButton,
  DeleteButton,
  AddButton,
} from "../../../Components/buttons";
import OutsideClickListener from "../../../Components/event-listeners";

function DataTableRow({
  item,
  facilities,
  onEdit,
  onDelete,
  onSave,
  setFacilities,
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
              const updatedFacilities = facilities.map((facilitie) =>
                facilitie.id === item.id
                  ? { ...facilitie, editedName: e.target.value }
                  : facilitie
              );
              setFacilities(updatedFacilities);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          item.facilitieName
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

function DataTable({ facilities, onEdit, onDelete, onSave, setFacilities }) {
  if (!facilities) {
    return (
      <div className="error-message">
        Error: Facility data is not available. Please try again later.
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
        {facilities.map((item) => (
          <DataTableRow
            item={item}
            key={item.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            facilities={facilities}
            setFacilities={setFacilities}
          />
        ))}
      </tbody>
    </table>
  );
}

export function AdminPropertyFacilities() {
  const [facilities, setFacilities] = useState(
    getFacilitiesFromLocalStorage() || []
  );
  const [showInput, setShowInput] = useState(false);
  const [newFacilitieName, setNewFacilitieName] = useState("");
  const [isAddingNewFacilitie, setIsAddingNewFacilitie] = useState(false);
  const [isEditingFacilitie, setIsEditingFacilitie] = useState(false);

  const handleAddButtonClick = () => {
    const newFacilitie = {
      id: facilities.length + 1,
      facilitieName: "",
      isEditing: false,
      editedName: "",
    };

    setNewFacilitie(newFacilitie);
    setNewFacilitieName("");
    setShowInput(true);
    setIsAddingNewFacilitie(true);
  };

  const handleAddFacilitie = () => {
    const isDuplicateName = facilities.some(
      (facilitie) => facilitie.facilitieName === newFacilitieName
    );

    if (isDuplicateName) {
      alert(
        "Facility with this name already exists. Please choose a new name."
      );
      return;
    }
    if (newFacilitieName.trim() !== "") {
      const newFacilitieToAdd = {
        id: newFacilitieName,
        facilitieName: newFacilitieName,
        isEditing: false,
        editedName: "",
      };
      const updatedFacilities = [...facilities, newFacilitieToAdd];
      setFacilities(updatedFacilities);
      saveFacilitiesToLocalStorage(updatedFacilities);
      setNewFacilitie({
        ...newFacilitieToAdd,
        facilitieName: "",
        isEditing: false,
        editedName: "",
      });
      setShowInput(false);
      setIsAddingNewFacilitie(false);
    } else {
      alert("Please enter a facility name.");
    }
  };

  const [newFacilitie, setNewFacilitie] = useState({
    id: facilities.length + 1,
    facilitieName: newFacilitieName,
    isEditing: false,
    editedName: "",
  });

  const handleEdit = (id) => {
    const updatedFacilities = facilities.map((item) => {
      if (item.id === id) {
        setIsEditingFacilitie(true);
        return {
          ...item,
          isEditing: !item.isEditing,
          editedName: item.facilitieName,
        };
      }
      return item;
    });

    const editedFacilitie = updatedFacilities.find((item) => item.id === id);
    setNewFacilitie(editedFacilitie);

    setFacilities(updatedFacilities);
    saveFacilitiesToLocalStorage(updatedFacilities);
  };

  const handleSave = (id) => {
    const updatedFacilities = facilities.map((item) => {
      if (item.id === id) {
        setIsEditingFacilitie(false);
        return {
          ...item,
          isEditing: false,
          facilitieName: item.editedName,
        };
      }
      return item;
    });

    setFacilities(updatedFacilities);
    saveFacilitiesToLocalStorage(updatedFacilities);
  };

  const handleDelete = (id) => {
    const updatedFacilities = facilities.filter((item) => item.id !== id);
    setFacilities(updatedFacilities);
    saveFacilitiesToLocalStorage(updatedFacilities);
  };
  const handleOutsideClick = () => {
    if (isAddingNewFacilitie && !isEditingFacilitie) {
      setIsAddingNewFacilitie(false);
      setShowInput(false);
    }

    if (isEditingFacilitie) {
      const updatedFacilities = facilities.map((item) => ({
        ...item,
        isEditing: false,
      }));
      setFacilities(updatedFacilities);
      setIsEditingFacilitie(false);
    }
  };

  return (
    <div className="PropertyContainer">
      <OutsideClickListener onOutsideClick={handleOutsideClick}>
        <div className="PropertyContent">
          <h1>FACILITIES</h1>
          <DataTable
            facilities={facilities}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            setFacilities={setFacilities}
            isAddingNewFacilitie={isAddingNewFacilitie}
            isEditingFacilitie={isEditingFacilitie}
            handleOutsideClick={handleOutsideClick}
            newFacilitie={newFacilitie}
          />
          {!showInput && <AddButton onAdd={handleAddButtonClick} />}
          {showInput && (
            <div className="AddContent">
              <input
                className="NameBox"
                type="text"
                value={newFacilitieName}
                onChange={(e) => setNewFacilitieName(e.target.value)}
                placeholder="Enter facility name"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingNewFacilitie(true);
                }}
                onFocus={(e) => e.stopPropagation()}
              />
              <SaveButton onSave={handleAddFacilitie} />
            </div>
          )}
        </div>
      </OutsideClickListener>
    </div>
  );
}
