import React, { useState } from "react";
import {
  savePropertiesToLocalStorage,
  getPropertiesFromLocalStorage,
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
  properties,
  onEdit,
  onDelete,
  onSave,
  setProperties,
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
              const updatedProperties = properties.map((propertie) =>
                propertie.id === item.id
                  ? { ...propertie, editedName: e.target.value }
                  : propertie
              );
              setProperties(updatedProperties);
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          item.propertieName
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

function DataTable({ properties, onEdit, onDelete, onSave, setProperties }) {
  if (!properties) {
    return (
      <div className="error-message">
        Error: Property data is not available. Please try again later.
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
        {properties.map((item) => (
          <DataTableRow
            item={item}
            key={item.id}
            onEdit={onEdit}
            onDelete={onDelete}
            onSave={onSave}
            properties={properties}
            setProperties={setProperties}
          />
        ))}
      </tbody>
    </table>
  );
}

export function AdminPropertyProperties() {
  const [properties, setProperties] = useState(
    getPropertiesFromLocalStorage() || []
  );
  const [showInput, setShowInput] = useState(false);
  const [newPropertieName, setNewPropertieName] = useState("");
  const [isAddingNewPropertie, setIsAddingNewPropertie] = useState(false);
  const [isEditingPropertie, setIsEditingPropertie] = useState(false);

  const handleAddButtonClick = () => {
    const newPropertie = {
      id: properties.length + 1,
      propertieName: "",
      isEditing: false,
      editedName: "",
    };

    setNewPropertie(newPropertie);
    setNewPropertieName("");
    setShowInput(true);
    setIsAddingNewPropertie(true);
  };

  const handleAddPropertie = () => {
    const isDuplicateName = properties.some(
      (propertie) => propertie.propertieName === newPropertieName
    );

    if (isDuplicateName) {
      alert(
        "Property with this name already exists. Please choose a new name."
      );
      return;
    }
    if (newPropertieName.trim() !== "") {
      const newPropertieToAdd = {
        id: newPropertieName,
        propertieName: newPropertieName,
        isEditing: false,
        editedName: "",
      };
      const updatedProperties = [...properties, newPropertieToAdd];
      setProperties(updatedProperties);
      savePropertiesToLocalStorage(updatedProperties);
      setNewPropertie({
        ...newPropertieToAdd,
        propertiesName: "",
        isEditing: false,
        editedName: "",
      });
      setShowInput(false);
      setIsAddingNewPropertie(false);
    } else {
      alert("Please enter a property name.");
    }
  };

  const [newPropertie, setNewPropertie] = useState({
    id: properties.length + 1,
    propertieName: newPropertieName,
    isEditing: false,
    editedName: "",
  });

  const handleEdit = (id) => {
    const updatedProperties = properties.map((item) => {
      if (item.id === id) {
        setIsEditingPropertie(true);
        return {
          ...item,
          isEditing: !item.isEditing,
          editedName: item.propertieName,
        };
      }
      return item;
    });

    const editedPropertie = updatedProperties.find((item) => item.id === id);
    setNewPropertie(editedPropertie);

    setProperties(updatedProperties);
    savePropertiesToLocalStorage(updatedProperties);
  };

  const handleSave = (id) => {
    const updatedProperties = properties.map((item) => {
      if (item.id === id) {
        setIsEditingPropertie(false);
        return {
          ...item,
          isEditing: false,
          propertiesName: item.editedName,
        };
      }
      return item;
    });

    setProperties(updatedProperties);
    savePropertiesToLocalStorage(updatedProperties);
  };

  const handleDelete = (id) => {
    const updatedProperties = properties.filter((item) => item.id !== id);
    setProperties(updatedProperties);
    savePropertiesToLocalStorage(updatedProperties);
  };
  const handleOutsideClick = () => {
    if (isAddingNewPropertie && !isEditingPropertie) {
      setIsAddingNewPropertie(false);
      setShowInput(false);
    }

    if (isEditingPropertie) {
      const updatedProperties = properties.map((item) => ({
        ...item,
        isEditing: false,
      }));
      setProperties(updatedProperties);
      setIsEditingPropertie(false);
    }
  };

  return (
    <div className="PropertyContainer">
      <OutsideClickListener onOutsideClick={handleOutsideClick}>
        <div className="PropertyContent">
          <h1>PROPERTIES</h1>
          <DataTable
            properties={properties}
            onEdit={handleEdit}
            onSave={handleSave}
            onDelete={handleDelete}
            setProperties={setProperties}
            isAddingNewPropertie={isAddingNewPropertie}
            isEditingPropertie={isEditingPropertie}
            handleOutsideClick={handleOutsideClick}
            newPropertie={newPropertie}
          />
          {!showInput && <AddButton onAdd={handleAddButtonClick} />}
          {showInput && (
            <div className="AddContent">
              <input
                className="NameBox"
                type="text"
                value={newPropertieName}
                onChange={(e) => setNewPropertieName(e.target.value)}
                placeholder="Enter property name"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingNewPropertie(true);
                }}
                onFocus={(e) => e.stopPropagation()}
              />
              <SaveButton onSave={handleAddPropertie} />
            </div>
          )}
        </div>
      </OutsideClickListener>
    </div>
  );
}
