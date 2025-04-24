import "./List.scss";
import { DataGrid } from "@mui/x-data-grid";
const List = ({ column, rows }) => {
  return (
    <div className="list">
      <DataGrid
        sx={{
          flex: 1,
          height: "650px",
          width: "100%",
          textAlign: "center",
          
        }}
        className="dataGrid"
        rows={rows}
        getRowId={(row) => row.id}
        columns={column}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[10]}
        disableRowSelectionOnClick
        checkboxSelection
      />
    </div>
  );
};

export default List;
