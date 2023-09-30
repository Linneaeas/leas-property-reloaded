import React, { useState } from "react";
import {
  saveStandardsToLocalStorage,
  getStandardsFromLocalStorage,
} from "../../Components/local-storage";
import { EditButton, SaveButton, DeleteButton, AddButton } from "../../Components/buttons";
import OutsideClickListener from "../../Components/event-listeners";

function DataTableRow({
    item,
    standards,
    onEdit,
    onDelete,
    onSave,
    setStandards,
    }) 
    {
   
    return (
      <tr className="DatatableRowOnEdit" key={item.id}>
        <td className="EditBTNBox">
          <EditButton onEdit={() => onEdit(item.id)} />
        </td>
        <td>
          {item.isEditing ? (
            <input
              type="text"
              value={item.editedName}
              onChange={(e) => {
                const updatedStandards = standards.map((standard) =>
                  standard.id === item.id
                    ? { ...standard, editedName: e.target.value }
                    : standard
                );
                setStandards(updatedStandards);
              }}
              onClick={(e) => e.stopPropagation()}/>
          ) : ( item.standardName)}
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


  function DataTable({
    standards,
    onEdit,
    onDelete,
    onSave,
    setStandards
  }) 
  {
    if (!standards) {
        return (
          <div className="error-message">
            Error: Standards data is not available. Please try again later.
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
          {standards.map((item) => (
            <DataTableRow
              item={item}
              key={item.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onSave={onSave}
              standards={standards}
              setStandards={setStandards}/>
          ))}
        </tbody>
      </table>
     ); 
    }
    

  export function AdminPropertyStandards() {
  const [standards, setStandards] = useState(getStandardsFromLocalStorage() || []);
  const [showInput, setShowInput] = useState(false);
  const [newStandardName, setNewStandardName] = useState("");
  const [isAddingNewStandard, setIsAddingNewStandard] = useState(false);
  const [isEditingStandard, setIsEditingStandard] = useState(false);

   
    const handleAddButtonClick = () => {
        const newStandard = {
            id: standards.length + 1,
            standardName: "",
            isEditing: false,
            editedName: "",
          };
      
          setNewStandard(newStandard);
          setNewStandardName("");
          setShowInput(true);
          setIsAddingNewStandard(true);
        };


        const handleAddStandard = () => {
            const isDuplicateName = standards.some(
              (standard) => standard.standardName === newStandardName
            );
        
            if (isDuplicateName) {
              alert("Standard with this name already exists. Please choose a new name.");
              return;
            }
            if (newStandardName.trim() !== "") {
              const newStandardToAdd = {
                id: newStandardName,
                standardName: newStandardName,
                isEditing: false,
                editedName: "",
              };
              const updatedStandards = [...standards, newStandardToAdd];
              setStandards(updatedStandards);
              saveStandardsToLocalStorage(updatedStandards);
              setNewStandard({
                ...newStandardToAdd,
                standardName: "",
                isEditing: false,
                editedName: "",
              });
              setShowInput(false);
              setIsAddingNewStandard(false);
            } else {
              alert("Please enter a standard name.");
            }
          };

          const [newStandard, setNewStandard] = useState({
            id: standards.length + 1,
            standardName: newStandardName,
            isEditing: false,
            editedName: "",
          });
  
          const handleEdit = (id) => {
            const updatedStandards = standards.map((item) => {
              if (item.id === id) {
                setIsEditingStandard(true);
                return {
                  ...item,
                  isEditing: !item.isEditing,
                  editedName: item.standardName,
                };
              }
              return item;
            });

            const editedStandard = updatedStandards.find((item) => item.id === id);
            setNewStandard(editedStandard);
        
            setStandards(updatedStandards);
            saveStandardsToLocalStorage(updatedStandards);
          };
        
      
          const handleSave = (id) => {
            const updatedStandards = standards.map((item) => {
              if (item.id === id) {
                setIsEditingStandard(false);
                return {
                  ...item,
                  isEditing: false,
                  standardName: item.editedName,
                };
              }
              return item;
            });
        
            setStandards(updatedStandards);
            saveStandardsToLocalStorage(updatedStandards);
          };
      
      
          const handleDelete = (id) => {
            const updatedStandards = standards.filter((item) => item.id !== id);
            setStandards(updatedStandards);
            saveStandardsToLocalStorage(updatedStandards);
          };
          const handleOutsideClick = () => {
            if (isAddingNewStandard && !isEditingStandard) {
              setIsAddingNewStandard(false);
              setShowInput(false);
            }
        
            if (isEditingStandard) {
              const updatedStandards = standards.map((item) => ({
                ...item,
                isEditing: false,
              }));
              setStandards(updatedStandards);
              setIsEditingStandard(false);
            }
          };

    return (
        <div className="PropertyContainer">
          <OutsideClickListener onOutsideClick={handleOutsideClick}>
            <div className="PropertyContent">
              <h1>STANDARDS</h1>
              <DataTable
                standards={standards} 
                onEdit={handleEdit}
                onSave={handleSave}
                onDelete={handleDelete}
                setStandards={setStandards}
                isAddingNewStandard={isAddingNewStandard}
                isEditingStandard={isEditingStandard}
                handleOutsideClick={handleOutsideClick}
                newStandard={newStandard}
              />
              {!showInput && <AddButton onAdd={handleAddButtonClick} />}
              {showInput && (
                <div className="AddContent">
                  <input
                    className="StandardName"
                    type="text"
                    value={newStandardName}
                    onChange={(e) => setNewStandardName(e.target.value)}
                    placeholder="Enter standard name"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsAddingNewStandard(true);
                      }}
                    onFocus={(e) => e.stopPropagation()}
                  />
                  <SaveButton onSave={handleAddStandard} />
                </div>
              )}
            </div>
          </OutsideClickListener>
        </div>
      );
    }