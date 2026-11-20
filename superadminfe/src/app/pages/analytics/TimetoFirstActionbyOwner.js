import JumboContentLayoutMain from '@jumbo/components/JumboContentLayout/JumboContentLayoutMain'
import React, { useState } from 'react'
import { ComponentHeading } from '../widgets/CRMStyles'
import { Typography } from '@mui/material'
import ColumnBarChart from './Bars/ColumnBarChart'
import { useDrawingArea } from '@mui/x-charts'
import Div from '@jumbo/shared/Div'
import { AutoHeight } from 'app/redux/auth/localStorage'

function TimetoFirstActionbyOwner() {
    const { width, height } = useDrawingArea();

    const time = (targetTime) => {
        const now = new Date();
        const target = new Date(targetTime);
        const difference = now.getTime() - target.getTime();

        if (difference >= 0) {
            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const formattedTime = `${hours}h ${minutes}m`;
            //   setTimeBefore(formattedTime);
            return formattedTime
        } else {
            //   setTimeBefore('Invalid time');
            return 'Invalid time'
        }
    }

    const dataSource = [
        { value: time("2024/02/09 09:30:00"), label: 'NEW INCOMING' },
        { value: time("2024/02/09 05:30:00"), label: 'OLD INCOMING' },
        { value: time("2024/02/09 02:30:00"), label: 'PITCH' },
        { value: time("2024/02/09 10:30:00"), label: "NEW STAGE" },
        { value: time("2024/02/09 11:30:00"), label: 'CONTRACT' },
        { value: time("2024/02/09 12:30:00"), label: 'FINAL REVIEWS' },
        { value: time("2024/02/09 13:30:00"), label: "SIGNED" },
        { value: time("2024/02/09 14:30:00"), label: 'WON' },
    ].reverse();

    return (
        <JumboContentLayoutMain>
            <Div sx={[{ p: { xs: 0, md: 2 }, px: { xs: 0, md: 4 },}]} >
                <Typography sx={[ComponentHeading, { mb: 3 }]}>Time to First Action by Owner </Typography>
                <ColumnBarChart
                    height={AutoHeight()}
                    rotated={true}
                    labelShow={true}
                    barData={dataSource}
                />
            </Div>
        </JumboContentLayoutMain>
    )
}

export default TimetoFirstActionbyOwner
