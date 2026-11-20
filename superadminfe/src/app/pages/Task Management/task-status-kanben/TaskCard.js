import * as React from "react";
import {
  Box,
  Card,
  CardHeader,
  Grid,
  Chip,
  Badge,
  IconButton,
  Typography,
  CardContent,
  CardActions,
  Avatar,
  Popover,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { styled } from "@mui/system";
import {
  Colors,
  componentTitle,
  CRMTableHead,
  dialogTitle,
  DisplayFlex,
  FontStyle,
} from "../widgets/CRMStyles";
import Div from "@jumbo/shared/Div";
import InfoIcon from "@mui/icons-material/Info";
import { AvatarCircle } from "app/pages/widgets/StylesComponents";

const Title = styled("div")(() => ({
  marginBottom: "1.5px",
  color: "#666666",
}));

const SubTitle = styled("span")(() => ({
  marginBottom: "1.5px",
  color: "#333333",
  fontWeight: "bold",
}));
const Heading = styled("div")(() => ({
  color: "#333333",
  fontWeight: "bold",
  fontSize: "16px",
}));

const rightIconAction = (
  <>
    <Badge
      badgeContent={4}
      color="error"
      sx={{
        "& .MuiBadge-badge": {
          right: "1.8px",
          top: "0.5px",
        },
      }}
    >
      <NotificationsNoneIcon color="action" />
    </Badge>
    <IconButton>
      <MoreVertIcon />
    </IconButton>
  </>
);

const PipeLineDeals = ({ item, index, avatar }) => {
  const [anchorElAction, setAnchorElAction] = React.useState(null);

  const handleCloseAction = () => {
    setAnchorElAction(null);
  };
  const handleClickAction = (event) => {
    setAnchorElAction(event.currentTarget);
  };
  console.log("item342", item);
  return (
    <>
      <Popover
        open={Boolean(anchorElAction)}
        anchorEl={anchorElAction}
        onClose={handleCloseAction}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: "250px" }}>
          <Div
            sx={[
              DisplayFlex,
              CRMTableHead,
              dialogTitle,
              { px: 2, justifyContent: "space-between" },
            ]}
          >
            <Typography id="Typography-root" sx={[dialogTitle]}>
              Overview
            </Typography>
          </Div>
        </Box>
        <Box sx={{ p: 2 }}>
          <Div sx={[DisplayFlex, { mb: 1, justifyContent: "space-between" }]}>
            <Div sx={[FontStyle]}>Account Name</Div>
            <Div sx={[FontStyle]}>{item?.Account_Name}</Div>
          </Div>
          <Div sx={[DisplayFlex, { my: 1, justifyContent: "space-between" }]}>
            <Div sx={[FontStyle]}>Deal Type</Div>
            <Div sx={[FontStyle]}>{item?.Deal_Type}</Div>
          </Div>
          <Div sx={[DisplayFlex, { my: 1, justifyContent: "space-between" }]}>
            <Div sx={[FontStyle]}>Deal Probablity</Div>
            <Div sx={[FontStyle]}>{item?.Deal_Probablity}%</Div>
          </Div>
          <Div sx={[DisplayFlex, { my: 1, justifyContent: "space-between" }]}>
            <Div sx={[FontStyle]}>Deal Type</Div>
            <Div sx={[FontStyle]}>{item?.Deal_Type}</Div>
          </Div>
          <Div sx={[DisplayFlex, { my: 1, justifyContent: "space-between" }]}>
            <Div sx={[FontStyle]}>Contact Person</Div>
            <Div sx={[FontStyle]}>{item?.Contact_Person}</Div>
          </Div>
          <Div sx={[DisplayFlex, { my: 1, justifyContent: "space-between" }]}>
            <Div sx={[FontStyle]}>Amount</Div>
            <Div sx={[FontStyle]}>
              {Boolean(item?.Amount) ? item?.Amount?.toLocaleString() : 0}
            </Div>
          </Div>
        </Box>
      </Popover>

      <Draggable
        key={item?.id + index}
        draggableId={String(item?.id)}
        index={index}
      >
        {(provided) => (
          <Div
            sx={{ py: 1 }}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Card
              sx={{
                width: { xs: "auto", md: "100% !important" },
                bgcolor: "#FAFAFA",
                border: "1px solid #E4E4E4",
                pb: 0,
                p: 1.5,
                borderRadius: "5px",
              }}
            >
              <CardContent sx={{ p: "5px", pb: 0 }}>
                <Div sx={[DisplayFlex, { justifyContent: "space-between" }]}>
                  <AvatarCircle
                    bgColor={avatar}
                    title={item?.Account_Name}
                    label={item?.Account_Name}
                    labelColor="black"
                    labelSize="17px"
                  />
                  {/* <Typography  id='Typography-root' sx={[{fontSize:'18px'}]} >{item.Contact_Person}</Typography> */}
                  <IconButton
                    sx={{ color: "#7d7d7d", cursor: "pointer" }}
                    onClick={handleClickAction}
                  >
                    {/* <InfoOutlinedIcon /> */}
                    <InfoIcon style={{ color: Colors?.Mblue }} />
                  </IconButton>
                </Div>
                <Div>
                  <Typography
                    id="Typography-root"
                    sx={[FontStyle, { ml: 3 }]}
                    color="text.secondary"
                  >
                    {item?.Deal_Type}
                  </Typography>
                </Div>
                <Div sx={[DisplayFlex, { mt: 1, justifyContent: "center" }]}>
                  <Div>
                    <Typography
                      id="Typography-root"
                      sx={[componentTitle, { mb: 0.7, color: "#121212" }]}
                    >
                      Deal Value
                    </Typography>
                    <Typography
                      id="Typography-root"
                      sx={[
                        componentTitle,
                        { color: "#ef7133", textAlign: "center" },
                      ]}
                    >
                      {Boolean(item?.Amount)
                        ? item?.Amount?.toLocaleString()
                        : 0}
                    </Typography>
                  </Div>
                </Div>
              </CardContent>
            </Card>
          </Div>
        )}
      </Draggable>
    </>
  );
};
export default PipeLineDeals;
