import React, { useEffect, useState } from "react";
//import "./groupmessage.css";
import styled, { css } from 'styled-components';
import { Button, Card, AppBar, Box, CssBaseline, Grid, Toolbar, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { fetchGroupById, joinGroup, exitGroup } from 'store/groupSlice';
import { useDispatch, useSelector } from 'react-redux';
import TextField from '@mui/material/TextField';
import { useParams } from "react-router";
import './groupDetails.css';

const GroupDetail = () => {
	const [groupName, setGroupName] = useState("");
	const [groupDescription, setGroupDescription] = useState("");
	const [groupOrigin, setGroupOrigin] = useState("");
	const [groupDestination, setGroupDestination] = useState("");
	const [groupStartDate, setGroupStartDate] = useState("");
	const [groupEndDate, setGroupEndDate] = useState("");

	const groupParams = useParams();
	const dispatch = useDispatch();
	const curGroup = useSelector((state) => state.groups.curGroup)

	useEffect(() => {
		if (curGroup) {
			setGroupName(curGroup.name);
			setGroupDescription(curGroup.description);
			setGroupDestination(curGroup.destination);
			setGroupEndDate(curGroup.endDate);
			setGroupOrigin(curGroup.origin);
			setGroupStartDate(curGroup.startDate);
		}
	}, [curGroup])

	useEffect(() => {
		dispatch(fetchGroupById(groupParams.groupid));
	}, [dispatch, groupParams.groupid]);
  
  const cleanFormat = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  }

	return (
     
      <div className="details-wrapper">
        <div className="details-body">
          <div className="details-body-wrapper d-flex">
            <ul className="details">        
              <li id="name">
                <p> Group Name </p>
                <p>{groupName}</p>
              </li>
              <li id="description">
                <p>Description</p>
                <p>{groupDescription}</p>
              </li>
              <li id="origin">
                <p>Origin</p>
                <p>{groupOrigin}</p>
              </li>
              <li id="destination">
                <p>Destination</p>
                <p>{groupDestination}</p>
              </li>
              <li id="startdate">
                <p>Start Date</p>
                <p>
                  {cleanFormat(groupStartDate)}
                </p>
              </li>

              <li id="enddate">
                <p>End Date</p>
                <p>{cleanFormat(groupEndDate)}</p>
              </li>

            </ul>
          </div>
		  
        </div>		
			
      </div>

    
	
  );

};

export default GroupDetail;
	