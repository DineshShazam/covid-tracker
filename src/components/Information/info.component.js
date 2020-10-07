import React from 'react'
import './info.css'
import {Card,CardContent,Typography} from '@material-ui/core'


const CaseInfo = ({active,isRed,title,cases,total,...props}) => {
    console.log(cases)

    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} > 
            <CardContent>
                {/* title */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                {/* Number of cases */}
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>TODAY : +{cases}</h2>

                {/* <h1 className="infoBox__cases">TOTAL : {total}</h1> */}
                {/* total */}
                <Typography className="infoBox__total">{total} total</Typography>

            </CardContent>
        </Card>
    )
}

export default CaseInfo