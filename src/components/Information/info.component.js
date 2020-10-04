import React from 'react'
import './info.css'
import {Card,CardContent,Typography} from '@material-ui/core'

const CaseInfo = ({title,cases,total}) => {

    return (
        <Card className='infoBox'> 
            <CardContent>
                {/* title */}
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>

                {/* Number of cases */}
                <h1 className="infoBox__cases">TODAY : {cases}</h1>

                {/* total */}
                <Typography className="infoBox__total">{total} total</Typography>

            </CardContent>
        </Card>
    )
}

export default CaseInfo