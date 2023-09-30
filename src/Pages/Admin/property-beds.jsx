import React, { useState } from "react";
import {
  saveBedsToLocalStorage,
  getBedsFromLocalStorage,
} from "../../Components/local-storage";
import { EditButton, SaveButton, DeleteButton, AddButton } from "../../Components/buttons";
import OutsideClickListener from "../../Components/event-listeners";

function DataTableRow({
    item,
    beds,
    onEdit,
    onDelete,
    onSave,
    setBeds,
    }) 
    {
        
        
          const handleBedSizeChange = (e) => {
            const updatedBeds = beds.map((bed) =>
              bed.id === item.id
                ? { ...bed, selectedBedSize: e.target.value }
                : bed
            );
            setBeds(updatedBeds);
          };
        
          const handleBedPersonsChange = (e) => {
            const updatedBeds = beds.map((bed) =>
              bed.id === item.id
                ? { ...bed, selectedBedPersons: parseInt(e.target.value, 10) || 0 }
                : bed
            );
            setBeds(updatedBeds);
          };
   
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
                const updatedBeds = beds.map((bed) =>
                  bed.id === item.id
                    ? { ...bed, editedName: e.target.value }
                    : bed
                );
                setBeds(updatedBeds);
              }}
              onClick={(e) => e.stopPropagation()}/>
          ) : ( item.bedName)}
        </td>
        <td className="BedSizeBox">
        {item.isEditing ? (
          <div className="InputWithDatalist">
            <input
              className="SmallInput"
              type="text"
              value={item.selectedBedSize}
              onChange={handleBedSizeChange}
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
              onChange={handleBedPersonsChange}
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


  function DataTable({
    beds,
    onEdit,
    onDelete,
    onSave,
    setBeds,
  }) 
  {
    if (!beds) {
        return (
          <div className="error-message">
            Error: Beds data is not available. Please try again later.
          </div>
        );
      }
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
              item={item}
              key={item.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onSave={onSave}
              beds={beds}
              setBeds={setBeds}/>
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
  const [newBed, setNewBed] = useState({
    id: beds.length + 1,
    bedName: "",
    isEditing: false,
    editedName: "",
    selectedBedSize: "",
    selectedBedPersons: "",
  });

  const handleAddButtonClick = () => {
    setIsAddingNewBed(true);
    setShowInput(true);
    setNewBedName("");
    setNewBed("");
  };

  const handleAddBed = () => {
    const { selectedBedSize, selectedBedPersons } = newBed;
    const isDuplicateName = beds.some((bed) => bed.bedName === newBedName);

    if (isDuplicateName) {
      alert("Bed with this name already exists. Please choose a new name.");
      return;
    }

    if (
      newBedName.trim() !== "" &&
      newBed.selectedBedSize.trim() !== "" &&
      newBed.selectedBedPersons.trim() !== ""
    ) {
      const newBedToAdd = {
        id: beds.length + 1,
        bedName: newBedName,
        isEditing: false,
        editedName: "",
        selectedBedSize: newBed.selectedBedSize,
        selectedBedPersons: newBed.selectedBedPersons,
      };

      const updatedBeds = [...beds, newBedToAdd];
      setBeds(updatedBeds);
      saveBedsToLocalStorage(updatedBeds);

      setShowInput(false);
      setIsAddingNewBed(false);
    } else {
      alert("Please enter a bed name, size, and amount of persons.");
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
                };
              }
              return item;
            });

            const editedBed = updatedBeds.find((item) => item.id === id);
            setNewBed({
              ...editedBed,
              selectedBedSize: editedBed.selectedBedSize || "",
              selectedBedPersons: editedBed.selectedBedPersons || "",
            });
        
            setBeds(updatedBeds);
            saveBedsToLocalStorage(updatedBeds);
          };
        
      
          const handleSave = (id) => {
            const uniqueId = new Date().getTime();
            const updatedBeds = beds.map((item) => {
              if (item.id === id) {
                setIsEditingBed(false);
                return {
                  ...item,
                  isEditing: false,
                  bedName: item.editedName,
                  selectedBedSize: item.selectedBedSize || "",
                  id: uniqueId,
                  selectedBedPersons: item.selectedBedPersons || "",
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
                onSave={handleSave}
                onDelete={handleDelete}
                setBeds={setBeds}
                isAddingNewBed={isAddingNewBed}
                isEditingBed={isEditingBed}
                handleOutsideClick={handleOutsideClick}
                newBed={newBed}
              />
              {!showInput && <AddButton onAdd={handleAddButtonClick} />}
              {showInput && (
                <div className="AddContent">
                  <input
                    className="BedName"
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
                onChange={(e) => {
                  const input = e.target.value;
                  const truncatedInput = input.slice(0, 3);

                  setNewBed((prevNewBed) => ({
                    ...prevNewBed,
                    selectedBedSize: truncatedInput,
                  }));

                  const updatedBeds = beds.map((bed) =>
                    bed.id === newBed.id
                      ? { ...bed, selectedBedSize: truncatedInput }
                      : bed
                  );

                  setBeds(updatedBeds);
                }}
                placeholder="CM"
                maxLength="3"
              />
              <input
                className="SmallInput"
                type="text"
                value={newBed.selectedBedPersons}
                onChange={(e) => {
                  const input = e.target.value;
                  const truncatedInput = input.slice(0, 3);

                  setNewBed((prevNewBed) => ({
                    ...prevNewBed,
                    selectedBedPersons: truncatedInput,
                  }));

                  const updatedBeds = beds.map((bed) =>
                    bed.id === newBed.id
                      ? { ...bed, selectedBedPersons: truncatedInput }
                      : bed
                  );

                  setBeds(updatedBeds);
                }}
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