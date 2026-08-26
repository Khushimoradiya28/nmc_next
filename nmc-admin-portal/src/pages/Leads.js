import React, { useContext, useState, useRef, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Select,
  Button,
  Card,
  CardBody,
  Pagination,
  Input,
} from "@windmill/react-ui";
import { FiFilter, FiRefreshCw, FiUpload } from "react-icons/fi";
import { CSVReader, CSVDownloader } from "react-papaparse";

import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import productData from "../utils/products";
import NotFound from "../components/table/NotFound";
import Loading from "../components/preloader/Loading";
import LeadServices from "../services/LeadServices";
import PageTitle from "../components/Typography/PageTitle";
import { SidebarContext } from "../context/SidebarContext";
import LeadTable from "../components/lead/LeadTable";
import SelectCategory from "../components/form/SelectCategory";
import MainDrawer from "../components/drawer/MainDrawer";
import ProductDrawer from "../components/drawer/ProductDrawer";
import Breadcrumb from "../components/form/Breadcrumb";
import LeadFilterDrawer from "../components/drawer/LeadFilterDrawer";

const Leads = () => {
  const {
    closeleadfilterDrawer,
    isleadfilterDrawerOpen,
    leadfiltertoggleDrawer,
    setIsUpdate,
  } = useContext(SidebarContext);
  // const { data, loading } = useAsync(async () => {
  //   const res = await LeadServices.getAllProducts();
  //   return res.data;
  // });
  // const leads = data?.data || [];

  const [filters, setFilters] = useState({
    from_date: "",
    to_date: "",
    lead_type: "",
  });
  const [searchText, setSearchText] = useState("");

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchRef = useRef(null);
  const leadFilterDrawerRef = useRef(null);

  const fetchLeads = async (payloadFilters, search = "") => {
    setLoading(true);
    try {
      const payload = {
        search,
        ...payloadFilters,
      };
      const res = await LeadServices.getAllLeads(payload);
      setData(res.data || []);
    } catch (err) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(filters, searchText);
  }, [filters, searchText]);

  const {
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleOnDrop,
    handleUploadProducts,
    currentPage,
  } = useFilter(data);

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setIsUpdate(true);
  };

  const isFilterApplied =
    Object.values(filters).some((val) => val !== "" && val !== null) ||
    searchText.trim() !== "";
  // console.log(isFilterApplied);

  const handleResetAll = () => {
    const emptyFilters = {
      lead_type: "",
      from_date: "",
      to_date: "",
    };

    setFilters(emptyFilters);
    setSearchText("");

    if (searchRef.current) {
      searchRef.current.value = "";
    }

    fetchLeads(emptyFilters, "");
  };

  const exportData = data.map((item, index) => ({
    "Sr No": index + 1,
    Name: item.first_name + " " + item.last_name,
    Email: item.email,
    Mobile: item.mobile,
    Type: item.lead_type,
    USOURCE: item.usource,
    UMEDIUM: item.umedium,
    UPCAMPAIGN: item.upcampaign,
    UCONTENT: item.ucontent,
    UTMTERM: item.utmterm,
    IREFERRE: item.ireferre,
    LREFERRE: item.lreferrer,
    ILANDPAGE: item.ilandpage,
    VISITS: item.visits,
    message: item.message,
    ip_address: item.ip_address,
    browser_name: item.browser_name,
    browser_version: item.browser_version,
    browser_platform: item.browser_platform,
    DATE: item.created_at,
  }));

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 my-2">
        {/* Title + Breadcrumb */}
        <div className="flex flex-col text-left w-full sm:w-auto">
          <PageTitle>Leads</PageTitle>

          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Leads" },
            ]}
          />
        </div>

        {/* Search + Add Btn */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-64">
            <Input
              ref={searchRef}
              onChange={handleInputChange}
              className="block w-full px-3 py-1 text-sm dark:text-gray-300 rounded-md 
                focus:border-gray-200 border-gray-200 dark:border-gray-600 
                focus:ring focus:ring-green-300 dark:bg-gray-700 bg-gray-100 h-10 pl-4"
              type="search"
              name="search"
              placeholder="Search"
            />
          </div>
          {/* Filter Button */}
          <div className="relative inline-flex">
            <Button
              onClick={leadfiltertoggleDrawer}
              className="w-full sm:w-auto rounded-md h-10 flex items-center justify-center"
              variant="outline"
            >
              <FiFilter size={18} />
            </Button>

            {isFilterApplied && (
              <span className="absolute top-0 right-0 flex h-3 w-3 -translate-y-1/2 translate-x-1/2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white"></span>
              </span>
            )}
          </div>

          <Button
            onClick={handleResetAll}
            className="w-full sm:w-auto rounded-md h-10 flex items-center justify-center"
            variant="outline"
          >
            <FiRefreshCw size={18} />
          </Button>

          <CSVDownloader
            data={exportData}
            filename={`leads_${new Date().toISOString().slice(0, 10)}`}
          >
            <Button
              className="w-full sm:w-auto rounded-md h-10 flex items-center justify-center"
              variant="outline"
              disabled={!exportData.length} // optional: disable if no data
            >
              <FiUpload size={18} />
            </Button>
          </CSVDownloader>
        </div>
      </div>

      <Card className="hidden min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0">
        <CardBody>
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-3">
            <div className="col-span-2">
              <CSVReader
                onDrop={handleOnDrop}
                addRemoveButton
                config={{
                  header: true,
                }}
                style={{
                  dropArea: {
                    borderColor: "green",
                    borderRadius: 6,
                    borderWidth: 1,
                    height: "3em",
                    padding: "0 0.2em",
                  },
                  dropAreaActive: {
                    borderColor: "green",
                  },
                  dropFile: {
                    width: "100%",
                    display: "block",
                    height: "auto",
                    background: "none",
                    borderRadius: 6,
                    padding: "0.2em 0.2em",
                  },
                  fileSizeInfo: {
                    color: "#fff",
                    backgroundColor: "#000",
                    borderRadius: 0,
                    lineHeight: 1,
                    fontSize: 12,
                    marginBottom: "0.5em",
                    padding: "0.3em 0.2em",
                  },
                  fileNameInfo: {
                    color: "#757575",
                    backgroundColor: "transparent",
                    borderRadius: 1,
                    fontSize: 14,
                    lineHeight: 1,
                    padding: "0 0.4em",
                  },
                  removeButton: {
                    color: "red",
                  },
                  progressBar: {
                    backgroundColor: "green",
                  },
                }}
              >
                <span className="text-sm text-gray-500">Drop CSV file</span>
              </CSVReader>
            </div>
            <div className="flex items-center">
              <Button onClick={handleUploadProducts} layout="outline">
                Upload
              </Button>
              {/* <div className="w-full">
                <CSVDownloader data={productData} filename={'products'}>
                  <Button className="w-full h-12">Download</Button>
                </CSVDownloader>
              </div> */}
            </div>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : serviceData.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>USOURCE</TableCell>
                <TableCell>UMEDIUM</TableCell>
                <TableCell>UPCAMPAIGN</TableCell>
                <TableCell>UCONTENT</TableCell>
                <TableCell>UTMTERM</TableCell>
                <TableCell>IREFERRE</TableCell>
                <TableCell>LREFERRE</TableCell>
                <TableCell>ILANDPAGE</TableCell>
                <TableCell>VISITS</TableCell>
                <TableCell>DATE</TableCell>
              </tr>
            </TableHeader>
            <LeadTable
              products={dataTable}
              currentPage={currentPage}
              resultsPerPage={resultsPerPage}
            />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Leads Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Lead" />
      )}
      <MainDrawer
        isDrawerOpen={isleadfilterDrawerOpen}
        closeDrawer={closeleadfilterDrawer}
        toggleDrawer={leadfiltertoggleDrawer}
      >
        <LeadFilterDrawer
          filter={filters}
          setFilter={setFilters} // <-- IMPORTANT
          onReset={() =>
            setFilters({ lead_type: "", from_date: "", to_date: "" })
          }
        />
      </MainDrawer>
    </>
  );
};

export default Leads;
