import "./App.css";
import {
  createIcon,
  Divider,
  Grid,
  GridItem,
  Heading,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
} from "@chakra-ui/react";
import { Map } from "./Components/Map";
import { Querier, QueryState } from "./Components/QueryBuilder";
import { CreateLog } from "./Components/Create";
import React from "react";
import { TableView } from "./Components/Graph";
import { LogoIcon } from "./IconSvg";

function App() {
  const [selectedNames, setSelectedNames] = React.useState<string[]>([]);
  const [selectedGenerations, setSelectedGenerations] = React.useState<
    string[]
  >([]);
  const [startDate, setStartDate] = React.useState<Date>(
    new Date(
      new Date().getFullYear() - 1,
      new Date().getMonth(),
      new Date().getDate()
    )
  );
  const [endDate, setEndDate] = React.useState<Date>(new Date());
  const [duration, setDuration] = React.useState<number[]>([5, 30]);
  const [view, setView] = React.useState<string>("map");
  const queryChanged = (partialState: Partial<QueryState>) => {
    setSelectedNames(partialState.selectedNames || selectedNames);
    setSelectedGenerations(
      partialState.selectedGenerations || selectedGenerations
    );
    setStartDate(partialState.startDate || startDate);
    setEndDate(partialState.endDate || endDate);
    setDuration(partialState.duration || duration);
  };

  return (
    <Grid
      templateAreas={`"header header"
                  "nav main"`}
      templateRows="repeat(21, 1fr)"
      templateColumns="repeat(4, 1fr)"
      h="full"
      height={"100vh"}
    >
      <GridItem
        area={"nav"}
        rowSpan={21}
        rowStart={2}
        gridGap={"0"}
        borderRight={"1px"}
        borderColor={"teal.400"}
        h="full"
      >
        <Tabs variant={"enclosed"} isFitted>
          <TabList>
            <Tab>Query</Tab>
            <Tab>Create</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Querier
                state={{
                  endDate,
                  startDate,
                  duration,
                  selectedNames,
                  selectedGenerations,
                }}
                onChange={queryChanged}
                radioViewProps={{
                  view,
                  onChange: setView,
                }}
              />
            </TabPanel>
            <TabPanel>
              <CreateLog />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </GridItem>
      <GridItem
        area={"header"}
        colStart={1}
        colSpan={8}
        rowStart={1}
        rowSpan={1}
        borderBottom={"1px"}
        borderColor={"teal.400"}
      >
        <HStack>
          <LogoIcon margin={"1"} />
          <Heading fontFamily={"mono"} size="lg">
            Drone Viewer - MX
          </Heading>
        </HStack>
      </GridItem>
      <GridItem
        area={"main"}
        colStart={2}
        rowStart={2}
        colSpan={6}
        rowSpan={21}
      >
        {view === "map" && (
          <Map
            queryState={{
              endDate,
              startDate,
              duration,
              selectedNames,
              selectedGenerations,
            }}
          />
        )}
        {view === "list" && (
          <TableView
            queryState={{
              endDate,
              startDate,
              duration,
              selectedNames,
              selectedGenerations,
            }}
          />
        )}
      </GridItem>
    </Grid>
  );
}

export default App;
