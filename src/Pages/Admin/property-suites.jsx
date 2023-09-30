import React, { useState } from "react";
import {
  saveSuitesToLocalStorage,
  getSuitesFromLocalStorage,
} from "../../Components/local-storage";
import { EditButton, SaveButton, DeleteButton, AddButton } from "../../Components/buttons";
import OutsideClickListener from "../../Components/event-listeners";

function DataTableRow({
    item,
    onEdit,
    onDelete,
    onSave,
    suites,
    setSuites
    }) 
    {
      const handleInputChange = (e) => {
        const updatedSuites = item.isEditing
          ? suites.map((suite) =>
            suite.id === item.id
            ? { ...suite, editedName: e.target.value }
            : suite )
        : suites; setSuites(updatedSuites);
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
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}/>
          ) : ( item.suiteName)}
        </td>
        <td className="SaveOrDeleteBTNBox">
          {item.isEditing && (
            <div className="onDeleteonSave">
              <DeleteButton onDelete={() => onDelete(item.id)} />
              <SaveButton onSave={() => onSave(item.id)} />
            </div>
          )}
        </td>
      </tr> 
    ); 
    }


  function DataTable({
    suites,
    onEdit,
    onDelete,
    onSave,
    setSuites
  }) 
  {
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
          {suites.map((item) => (
            <DataTableRow
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onSave={onSave}
              suites={suites}
              setSuites={setSuites}/>
          ))}
        </tbody>
      </table>
     ); 
    }
    

    export function AdminPropertySuites() {
        const [state, setState] = useState({
          suites: getSuitesFromLocalStorage() || [],
          showInput: false,
          newSuiteName: "",
          isAddingNewSuite: false,
          isEditingSuite: false,
          newSuite: {
            id: 0, // Initialize to 0 initially
            suiteName: "",
            isEditing: false,
            editedName: "",
          }
        });
      
        const { suites, showInput, newSuiteName, isAddingNewSuite, isEditingSuite } = state;
   
    const handleAddButtonClick = () => {
        setState(prevState => ({
          ...prevState,
          newSuite: {
            ...prevState.newSuite,
            id: prevState.suites.length + 1,
            suiteName: "",
            isEditing: false,
            editedName: "",
          },
          newSuiteName: "",
          showInput: true,
          isAddingNewSuite: true
        }));
    };
    const handleAddSuite = () => {
      const isDuplicateName = suites.some((suite) => suite.suiteName === newSuiteName);
        if (isDuplicateName) { alert("Suite with this name already exists. Please choose a new name."); return;
        }
          if (newSuiteName.trim() === "") { alert("Please enter a suite name."); return;
        }
        const newSuiteToAdd = {
          id: newSuiteName,
          suiteName: newSuiteName,
          isEditing: false,
          editedName: "",
        };
        const updatedSuites = [...suites, newSuiteToAdd];
        setState(prevState => ({
          ...prevState,
          suites: updatedSuites,
          newSuite: {
            id: prevState.newSuite.id + 1,
            suiteName: "",
            isEditing: false,
            editedName: "",
          },
          showInput: false,
          isAddingNewSuite: false
        }));
        saveSuitesToLocalStorage(updatedSuites);
    };
    const handleEdit = (id) => {
      const updatedSuites = suites.map((item) => ({
          ...item,
          isEditing: item.id === id,
          editedName: item.id === id ? item.suiteName : item.editedName,
        }));
        setState(prevState => ({
          ...prevState,
          suites: updatedSuites,
          isEditingSuite: true,
          newSuite: updatedSuites.find((item) => item.id === id) || prevState.newSuite
        }));
    };
    const handleSave = (id) => {
      const updatedSuites = suites.map((item) => ({
          ...item,
          isEditing: false,
          suiteName: item.id === id ? item.editedName : item.suiteName,
        }));
        setState(prevState => ({
          ...prevState,
          suites: updatedSuites,
          isEditingSuite: false,
        }));
        saveSuitesToLocalStorage(updatedSuites);
    };
    const handleDelete = (id) => {
      const updatedSuites = suites.filter((item) => item.id !== id);
        setState(prevState => ({
          ...prevState,
          suites: updatedSuites
        }));
        saveSuitesToLocalStorage(updatedSuites);
    };
    const handleOutsideClick = () => {
        if (isAddingNewSuite && !isEditingSuite) {
          setState(prevState => ({
            ...prevState,
            isAddingNewSuite: false,
            showInput: false
          }));
        }
        if (isEditingSuite) {
          const updatedSuites = suites.map((item) => ({
            ...item,
            isEditing: false
          }));
          setState(prevState => ({
            ...prevState,
            suites: updatedSuites,
            isEditingSuite: false
          }));
        }
    };
    return (
        <div className="PropertyContainer">
          <OutsideClickListener onOutsideClick={handleOutsideClick}>
            <div className="PropertyContent">
              <h1>SUITES</h1>
              <DataTable
                suites={state.suites}
                onEdit={handleEdit}
                onSave={handleSave}
                onDelete={handleDelete}
                setSuites={setState}
                isAddingNewSuite={state.isAddingNewSuite}
                isEditingSuite={state.isEditingSuite}
                handleOutsideClick={handleOutsideClick}
                newSuite={state.newSuite}
              />
              {!state.showInput && <AddButton onAdd={handleAddButtonClick} />}
              {state.showInput && (
                <div className="AddContent">
                  <input
                    className="SuiteName"
                    type="text"
                    value={state.newSuiteName}
                    onChange={(e) =>
                      setState((prevState) => ({
                        ...prevState,
                        newSuiteName: e.target.value,
                      }))
                    }
                    placeholder="Enter suite name"
                    onClick={(e) => {
                      e.stopPropagation();
                      setState((prevState) => ({
                        ...prevState,
                        isAddingNewSuite: true,
                      }));
                    }}
                    onFocus={(e) => e.stopPropagation()}
                  />
                  <SaveButton onSave={handleAddSuite} />
                </div>
              )}
            </div>
          </OutsideClickListener>
        </div>
      );
    }