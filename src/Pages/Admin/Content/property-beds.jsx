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
//“Beds” innehåller 4 stycken huvudfunktioner:
//CreateNewBed. DatatableRow. DataTable. AdminPropertyBeds.
//"Beds” är den enda av “Content” komponenterna som har “CreateNew” funktionen. Den har jag för att tydligt bestämma vad en säng ska innehålla då en säng innehåller flera egenskaper än ett namn. Jag skapade en egen funktion för att tydliggöra och underlätta då framtida funktioner är beroende av användarens val for uträkning.
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
//I DataTableRow komponenten bestämmer jag ut hur en rad ska fungera beroende på om raden är i “edit mode” eller inte. Den tar emot olika funktioner som props från "AdminPropertyBeds funktionen"
//If item is editing is true, kör koden innanför första parantesen, om det är false, kör koden inom andra parantesen( efter : )
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
//I DataTable komponenten sammanställer jag dem skapade dataTableRows till en tabell. Jag använder “MAP” funktionen för att gå igenom arrayen med “Beds” och skapa en ny array en: “tableRow” baserat på innehållet i “Beds” arrayen.
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

//Här finns alla funktioner som används, som skickas som props till DataTableRow och DataTable. Den hanterar alla states relaterade till “Beds” och hanterar funktionerna för att skapa, redigera och ta bort objekt.
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
    //Använder "SOME" metoden som kallar på "beds" och tar en callback function(=>) som argument för att kolla om värdet för "newBedName" är samma som värdet av en existerande "bedName" i beds arrayen. Om värdet är samma blir resultated "True".
    //Använder "TRIM" metoden för att ta bort whitespaces från början & slutet av en string. Resultatet jämförs med en tom string. Om resultated är en tom string blir värdet "true", och då visas en alert.
    const isSizeNotFilled = newBed.selectedBedSize.trim() === "";
    const isPersonsNotFilled = newBed.selectedBedPersons.trim() === "";
    if (isDuplicateName) {
      alert("Bed with this name already exists. Please choose a new name.");
    } else if (newBedName.trim() === "") {
      alert("Please enter a bed name.");
    } else if (isSizeNotFilled || isPersonsNotFilled) {
      alert("Please enter values for both Size and Persons.");
    } else {
      const newBedData = {
        id: beds.length + 1,
        bedName: newBedName,
        selectedBedSize: newBed.selectedBedSize,
        selectedBedPersons: parseInt(newBed.selectedBedPersons),
        //Här konverterar jag värdet från en string till en integer.
        isEditing: false,
        editedName: "",
      };
      const updatedBeds = [...beds, newBedData]; //Skapar en ny array "updatedBeds"
      setBeds(updatedBeds); //Uppdaterar State variabeln "beds" med den nya arrayen "updatedBeds"
      saveBedsToLocalStorage(updatedBeds);
      setNewBed({
        id: beds.length + 1,
        bedName: "",
        selectedBedSize: "",
        selectedBedPersons: "",
        isEditing: false,
        editedName: "",
      });
      //Sätter staten för en newBed's egenskaper till ett initialt state för den nya sängen till tomma värden.
      setShowInput(false); //Gömmer input fälten
      setIsAddingNewBed(false);
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
    //Använder "FIND" metoden på updatedBeds som genom en callback funktion kollar om "id" egenskapen på ett element i arrayen är samma som id:et på elementet, "Find" metoden stannar direkt när en match har hittats, om inget element matchar returneras det "undefined".
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
          selectedBedPersons: parseInt(newBed.selectedBedPersons), // Ser till att värdet konverteras till en integer.
        };
      }
      return item;
    });
    setBeds(updatedBeds);
    saveBedsToLocalStorage(updatedBeds);
  };

  const handleDelete = (id) => {
    const updatedBeds = beds.filter((item) => item.id !== id);
    //Använder "FILTER" metoden som går igenom varje element i "beds" och behåller endast dem som inte (!) har samma id som det givna id:et.
    setBeds(updatedBeds);
    saveBedsToLocalStorage(updatedBeds);
  };
  const handleOutsideClick = () => {
    if (isAddingNewBed && !isEditingBed) {
      setIsAddingNewBed(false);
      setShowInput(false);
    } //OM en säng redigeras och en click outside occours -stäng "edit mode".
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
          {showInput && ( //Om showInput is False(!), visas Add button. Om showInput is True kommer "Add content" köras.
            <div className="AddContent">
              <input
                className="NameBox"
                type="text"
                value={newBedName}
                onChange={(e) => setNewBedName(e.target.value)}
                placeholder="Enter bed name"
                onClick={(e) => {
                  e.stopPropagation(); //För att inte trigga några eventshandlers som inte ska triggas just här. Just nu gör den nog inget, men hade problem tidigare då input fält på en annan komponent öppnades istallet för här(verision 2)
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
