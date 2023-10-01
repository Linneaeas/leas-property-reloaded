import React, { useEffect, useState } from "react";
import {
  saveBedsToLocalStorage,
  getBedsFromLocalStorage,
} from "../../../Components/local-storage";
import {
  EditButton,
  SaveButton,
  DeleteButton,
  AddButton,
} from "../../../Components/buttons";
import OutsideClickListener from "../../../Components/event-listeners";

export function CreateNewBed(id) {
  return {
    id,
    bedName: "",
    selectedBedSize: "",
    selectedBedPersons: "",
    isEditing: false,
    editedName: "",
  };
}

export function DataTableRow({
  item,
  beds,
  onEdit,
  onDelete,
  onSave,
  setBeds,
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
              const updatedBeds = beds.map((bed) =>
                bed.id === item.id
                  ? { ...bed, editedName: e.target.value }
                  : bed
              );
              setBeds(updatedBeds);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          item.bedName
        )}
      </td>
      <td className="BedSizeBox">
        {item.isEditing ? (
          <div className="InputWithDatalist">
            <input
              className="SmallInput"
              type="text"
              value={item.selectedBedSize}
              onChange={(e) => {
                const updatedBeds = beds.map((bed) =>
                  bed.id === item.id
                    ? { ...bed, selectedBedSize: e.target.value }
                    : bed
                );
                setBeds(updatedBeds);
              }}
              placeholder="CM"
              maxLength="3"
            />
          </div>
        ) : (
          item.selectedBedSize || "N/A"
        )}
      </td>
      <td className="BedPersonsBox">
        {item.isEditing ? (
          <div className="InputWithDatalist">
            <input
              className="SmallInput"
              type="text"
              value={item.selectedBedPersons}
              onChange={(e) => {
                const updatedBeds = beds.map((bed) =>
                  bed.id === item.id
                    ? { ...bed, selectedBedPersons: e.target.value }
                    : bed
                );
                setBeds(updatedBeds);
              }}
              placeholder="PRS"
              maxLength="3"
            />
          </div>
        ) : (
          item.selectedBedPersons || "N/A"
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

function DataTable({ beds, onEdit, onDelete, onSave, setBeds }) {
  return (
    <table className="PropertyTable">
      <thead>
        <tr>
          <th></th>
          <th className="ColoumnHeadline">Name:</th>
          <th className="ColoumnHeadline">Size:</th>
          <th className="ColoumnHeadline">Prs:</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {beds.map((item) => (
          <DataTableRow
            key={item.id}
            item={item}
            beds={beds}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            setBeds={setBeds}
          />
        ))}
      </tbody>
    </table>
  );
}

export function AdminPropertyBeds() {
  const [beds, setBeds] = useState(getBedsFromLocalStorage() || []);
  const [showInput, setShowInput] = useState(false);
  const [newBedName, setNewBedName] = useState("");
  const [isAddingNewBed, setIsAddingNewBed] = useState(false);
  const [isEditingBed, setIsEditingBed] = useState(false);
  const [newBed, setNewBed] = useState(CreateNewBed(beds.length + 1));

  const handleAddButtonClick = () => {
    setNewBed(CreateNewBed(beds.length + 1));
    setNewBedName("");
    setShowInput(true);
    setIsAddingNewBed(true);
  };

  const handleAddBed = () => {
    const isDuplicateName = beds.some((bed) => bed.bedName === newBedName);
    if (isDuplicateName) {
      alert("Bed with this name already exists. Please choose a new name.");
      return;
    }
    if (newBedName.trim() !== "") {
      const newBedData = {
        id: beds.length + 1,
        bedName: newBedName,
        selectedBedSize: newBed.selectedBedSize,
        selectedBedPersons: newBed.selectedBedPersons,
        isEditing: false,
        editedName: "",
      };

      const updatedBeds = [...beds, newBedData];
      setBeds(updatedBeds);
      saveBedsToLocalStorage(updatedBeds);
      setNewBed({
        id: beds.length + 1,
        bedName: "",
        selectedBedSize: "", // Reset to empty string
        selectedBedPersons: "", // Reset to empty string
        isEditing: false,
        editedName: "",
      });

      setShowInput(false);
      setIsAddingNewBed(false);
    } else {
      alert("Please enter a bed name.");
    }
  };

  const handleEdit = (id) => {
    const updatedBeds = beds.map((item) => {
      if (item.id === id) {
        setIsEditingBed(true);
        return {
          ...item,
          isEditing: !item.isEditing,
          editedName: item.bedName,
          selectedBedSize: item.selectedBedSize,
          selectedBedPersons: item.selectedBedPersons,
        };
      }
      return item;
    });

    const editedBed = updatedBeds.find((item) => item.id === id);
    setNewBed(editedBed);

    setBeds(updatedBeds);
    saveBedsToLocalStorage(updatedBeds);
  };

  const handleSave = (id) => {
    const updatedBeds = beds.map((item) => {
      if (item.id === id) {
        setIsEditingBed(false);
        return {
          ...item,
          isEditing: false,
          bedName: item.editedName,
          selectedBedSize: item.selectedBedSize,
          selectedBedPersons: item.selectedBedPersons,
        };
      }
      return item;
    });
    setBeds(updatedBeds);
    saveBedsToLocalStorage(updatedBeds);
  };

  const handleDelete = (id) => {
    const updatedBeds = beds.filter((item) => item.id !== id);
    setBeds(updatedBeds);
    saveBedsToLocalStorage(updatedBeds);
  };
  const handleOutsideClick = () => {
    if (isAddingNewBed && !isEditingBed) {
      setIsAddingNewBed(false);
      setShowInput(false);
    }

    if (isEditingBed) {
      const updatedBeds = beds.map((item) => ({
        ...item,
        isEditing: false,
      }));
      setBeds(updatedBeds);
      setIsEditingBed(false);
    }
  };

  return (
    <div className="PropertyContainer">
      <OutsideClickListener onOutsideClick={handleOutsideClick}>
        <div className="PropertyContent">
          <h1>BEDS</h1>
          <DataTable
            beds={beds}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSave={handleSave}
            setBeds={setBeds}
            handleOutsideClick={handleOutsideClick}
          />
          {!showInput && <AddButton onAdd={handleAddButtonClick} />}
          {showInput && (
            <div className="AddContent">
              <input
                className="NameBox"
                type="text"
                value={newBedName}
                onChange={(e) => setNewBedName(e.target.value)}
                placeholder="Enter bed name"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingNewBed(true);
                }}
                onFocus={(e) => e.stopPropagation()}
              />
              <input
                className="SmallInput"
                type="text"
                value={newBed.selectedBedSize}
                onChange={(e) =>
                  setNewBed((prevNewBed) => ({
                    ...prevNewBed,
                    selectedBedSize: e.target.value,
                  }))
                }
                placeholder="CM"
                maxLength="3"
              />
              <input
                className="SmallInput"
                type="text"
                value={newBed.selectedBedPersons}
                onChange={(e) =>
                  setNewBed((prevNewBed) => ({
                    ...prevNewBed,
                    selectedBedPersons: e.target.value,
                  }))
                }
                placeholder="PRS"
                maxLength="3"
              />
              <SaveButton onSave={handleAddBed} />
            </div>
          )}
        </div>
      </OutsideClickListener>
    </div>
  );
}
