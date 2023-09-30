import React from 'react'
import { AdminPropertySuites } from './property-suites'
import { AdminPropertyStandards } from './property-standards'
import { AdminPropertyRoomtypes } from './property-roomtypes'
import { AdminPropertyFacilities } from './property-facilities'
import { AdminPropertyProperties } from './property-properties'
import { AdminPropertyBeds } from './property-beds'


export function AdminPropertyContent() {
  return (
    <div className="PropertyContentContainer">
      <AdminPropertySuites></AdminPropertySuites>
      <AdminPropertyStandards></AdminPropertyStandards>
      <AdminPropertyRoomtypes></AdminPropertyRoomtypes>
      <AdminPropertyBeds></AdminPropertyBeds>
      <AdminPropertyFacilities></AdminPropertyFacilities>
      <AdminPropertyProperties></AdminPropertyProperties>
     
   
    </div>
  )
}
