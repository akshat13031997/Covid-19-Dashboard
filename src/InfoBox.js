import React from 'react';
import {Card, Typography, CardContent} from '@material-ui/core';
import "./infobox.css";
function InfoBox({title,active,cases,total,...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active &&'info-Box--selected'}`}>

            <CardContent>
                <Typography className="info_box_title" color='textSecondary'>{title}</Typography>
                <h2 className="info_box_cases">{cases}</h2>
                <Typography className='info_box_total' color='textSecondary'>{total} Total</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox
