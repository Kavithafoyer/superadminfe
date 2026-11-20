import React from 'react';
import { DialogContent, Grid } from '@mui/material';
import Div from "@jumbo/shared/Div";
import { Dragabledialog } from "app/pages/widgets/StylesComponents";
import { FontStyle } from "../../widgets/CRMStyles";
import CreatePlanForm from "./CreatePlanForm";


const CreatePlanDialogs = ({
  createPlan,
  setCreatePlan,
  setListPlan,
  getPlanRecords,
  editPlan,
  setEditPlan,
  editdatas,
  viewPlan,
  setViewPlan,
  viewdatas,
}) => {
  return (
    <>
      {/* Create Lookup modal */}
      <Dragabledialog
        maxWidth="lg"
        open={createPlan}
        title="Create Plan"
        onClose={() => setCreatePlan(false)}
      >
        <DialogContent sx={{ p: 1 }}>
          <CreatePlanForm
            setCreatePlan={setCreatePlan}
            setListPlan={setListPlan}
            getPlanRecords={getPlanRecords}
          />
        </DialogContent>
      </Dragabledialog>

      {/* edit plan */}
      <Dragabledialog
        maxWidth="lg"
        open={editPlan}
        title="Edit Plan"
        onClose={() => setEditPlan(false)}
      >
        <DialogContent sx={{ p: 1 }}>
          <CreatePlanForm
            setEditPlan={setEditPlan}
            setListPlan={setListPlan}
            editdatas={editdatas}
            getPlanRecords={getPlanRecords}
          />
        </DialogContent>
      </Dragabledialog>

      {/* view plan */}
      <Dragabledialog
        maxWidth="md"
        open={viewPlan}
        title="Plan OverView"
        onClose={() => setViewPlan(false)}
      >
        <DialogContent sx={{ p: 1 }}>
          <Grid container columns={12}>
            <Grid item xs={5.5}>
              <Div sx={[FontStyle, { mt: 1 }]}>Product Name</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Plan Name</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Plan Type</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Price</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Minimum users</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Storage</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Addon Price</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Country</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Country Code</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Billing Cycle</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>Plan Details</Div>
            </Grid>
            <Grid item xs={0.5}>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>:</Div>
            </Grid>
            <Grid item xs={6}>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.Product}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.Plan_Name}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.Plantype}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.UnitPrice}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.No_Of_Users}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.AllocatedStorage}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.Addon_Price}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.Country}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.Currency_Type}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.billing_cycle}</Div>
              <Div sx={[FontStyle, { mt: 1 }]}>{viewdatas?.PlanDetails}</Div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dragabledialog>
    </>
  );
};

export default CreatePlanDialogs;
