import { useNavigate } from "react-router-dom"
import { useMediaQuery } from "./../../Hooks/mediaQuery"
import { retriveData } from "../../utils/localStorage"
import { Chart } from "react-google-charts"
import { MainUrl } from "../../../variables"
import "../../../src/App.scss"
import { WiHumidity } from "react-icons/wi";
import { FaTemperatureHigh } from "react-icons/fa";
import { IoMdResize } from "react-icons/io";
import { Box, SimpleGrid, Icon, Text, useToast, Flex } from "@chakra-ui/react"
import { Grid, GridItem } from '@chakra-ui/react'
import { useEffect, useState } from "react"
import { io } from "socket.io-client"



export const Dash = () => {
    let screenSize = useMediaQuery()
    const [sizeData, setSizeData] = useState(null)
    const [theresizeData, settheresizeData] = useState(false)
    let [data, setData] = useState(null)
    let [graphData, setGraphData] = useState(null)
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState("")
    const navigator = useNavigate()
    const toast = useToast()
    useEffect(() => {
        //
        const fetchData = async () => {
            try {
                // Set loading to true while fetching data
                setLoading(true);

                // Fetch data from an API (replace with your API endpoint)
                const response = await fetch(`${MainUrl}data/retrieve/${retriveData("PData")._id}`);
                const result = await response.json();

                // Set the fetched data to the state
                setData(result.body);
                setLoading(false);
            } catch (error) {
                // Set error state in case of an error
                setError(error);
            } finally {
                // Set loading to false once the data is fetched (whether successful or not)
                setLoading(false);
            }
        };

        // Call the fetchData function when the component mounts
        fetchData();


        const fetchGraphData = async () => {
            try {

                // Set loading to true while fetching data
                setLoading(true);
                // Fetch data from an API (replace with your API endpoint)
                const response = await fetch(`${MainUrl}data/graphdata/${retriveData("PData")?.deviceId}`);
                const result = await response.json();
                // console.log(result);
                if (result.success) {
                    let results = result?.body?.reverse();
                    let dataArray = [["Time", "Temp", "Hum"]]
                    results.map(element => {
                        dataArray.push([element?.createdAt.slice(11, 16), element?.temp, element?.hum])
                    })
                    setGraphData(dataArray)
                }
                // Set the fetched data to the state
                setLoading(false);
            } catch (error) {
                // Set error state in case of an error
                setError(error);
            } finally {
                // Set loading to false once the data is fetched (whether successful or not)
                setLoading(false);
            }
        };

        fetchGraphData();
    }, [])

    const options = {
        title: "Temp + Humidity",
        titleTextStyle: {
            fontSize: 20
        },
        legend: { position: "bottom" },
    };
    const option2 = {
        title: "Average size (Day vs Size)",
        titleTextStyle: {
            fontSize: 20
        },
        legend: { position: "bottom" },
    };




    useEffect(() => {
        let socket = io(MainUrl)
        socket.on("connect", () => {
            console.log("connected... successfull, id: ", socket.id);
        })
        socket.on("newData", (data) => {
            if (retriveData("PData")._id == data.userId) {
                setData(data)
                console.log("runned initially...");
                setGraphData((prevData) => {
                    if (prevData) {
                        setGraphData([prevData[0], ...prevData?.slice(2), [data?.createdAt?.slice(11, 16), data?.temp, data?.hum, data?.size]])

                    }
                })
                // fired socket should update the graph too
                // let graphDataCopy = graphData;
                // console.log("copy:   ", graphDataCopy);
                // let dataGraphMod = [graphDataCopy[0], ...graphDataCopy.slice(2), [data?.createdAt.slice(11, 16), data?.temp, data?.hum, data?.size]];
                // console.log(dataGraphMod);
                // setGraphData(dataGraphMod)
            }
        })
    }, [])

    useEffect(() => {
        const fetchSizes = async () => {
            try {

                // Set loading to true while fetching data
                settheresizeData(false);
                // Fetch data from an API (replace with your API endpoint)
                const response = await fetch(`${MainUrl}data/graphdata/sizes/${retriveData("PData")?.deviceId}`);
                const result = await response.json();
                console.log(result);
                if (result.success) {
                    let results = result?.body;
                    let dataArray = [["Time", "Avg Size"]]
                    results.map(element => {
                        dataArray.push([element?._id.slice(6, 10), element?.avg])
                    })
                    setSizeData(dataArray)
                    settheresizeData(true)
                }
                // Set the fetched data to the state
                setLoading(false);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSizes();
    }, [])


    const navigateTo = (path) => {
        navigator(`/auth/${retriveData("PData")._id}/history/${path}`)
    }

    return (
        <>
            <Box px="0.7rem" mx="auto">
                <Box>
                    <Box mx="auto" pt="3rem" width={{ base: '100%', sm: '80%', md: '70%' }}>
                        <Box >
                            <SimpleGrid
                                backgroundColor=""
                                columns={{ sm: 2, md: 3 }}
                                spacing='10'
                                px={screenSize.width < 600 ? '2' : '0'}
                                color='inherit'
                            >
                                <Box boxShadow='2xl' cursor="pointer" py='5' display="flex" rounded='xl' bg='#8ecae6' onClick={() => navigateTo("Temperature")}>
                                    <Box px="0.5rem">
                                        <Icon color="#023047" ml="0.7rem" boxSize="3.4rem" as={FaTemperatureHigh} />
                                    </Box>
                                    <Box pl="0.7rem">
                                        <Text color="pink.900" fontSize={((screenSize.width > 539 && screenSize.width < 700) || (screenSize.width > 750 && screenSize.width < 1110)) ? '1.2rem' : '1.5rem'} fontWeight="bold">Temperature</Text>
                                        <Text color="#fb8500" fontSize="1.3rem" fontWeight="bold">{Number(data?.temp).toFixed(2)} C</Text>
                                    </Box>
                                </Box>

                                <Box boxShadow='2xl' cursor="pointer" py='5' display="flex" rounded='xl' bg='#8ecae6' onClick={() => navigateTo("Humidity")}>
                                    <Box px="0.5rem">
                                        <Icon color="#023047" ml="0.7rem" boxSize="3.4rem" as={WiHumidity} />
                                    </Box>
                                    <Box pl="0.7rem">
                                        <Text color="pink.900" fontSize={((screenSize.width > 539 && screenSize.width < 700) || (screenSize.width > 750 && screenSize.width < 1110)) ? '1.2rem' : '1.5rem'} fontWeight="bold">Humidity</Text>
                                        <Text color="#fb8500" fontSize="1.3rem" fontWeight="bold">{Number(data?.hum).toFixed(2)} %</Text>
                                    </Box>
                                </Box>
                                <Box cursor="pointer" boxShadow='2xl' py='5' display="flex" rounded='xl' bg='#8ecae6' onClick={() => navigateTo("size")}>
                                    <Box px="0.5rem">
                                        <Icon color="#023047" ml="0.7rem" boxSize="3.4rem" as={IoMdResize} />
                                    </Box>
                                    <Box pl="0.7rem">
                                        <Text color="pink.900" fontSize={((screenSize.width > 539 && screenSize.width < 700) || (screenSize.width > 750 && screenSize.width < 1110)) ? '1.2rem' : '1.5rem'} fontWeight="bold">Size</Text>
                                        <Text color="#fb8500" fontSize="1.3rem" fontWeight="bold">{data?.size}</Text>
                                    </Box>
                                </Box>
                            </SimpleGrid>
                        </Box>

                    </Box>

                    <Flex mx="auto" flexWrap="wrap" pt="2rem" width={{ base: '100%', sm: '80%', md: '70%' }} justify="space-between">
                        <Box width={{ base: "100%", md: "48%" }} marginBottom={{ base: "4", md: "0" }}>
                            {!loading &&
                                <Box shadow="dark-lg" my="1.7rem" mx="auto" >
                                    <Chart
                                        chartType="LineChart"
                                        width="100%"
                                        height="420px"
                                        data={graphData}
                                        options={options}
                                    />
                                </Box>
                            }
                        </Box>
                        <Box width={{ base: "100%", md: "48%" }}>
                            {theresizeData &&
                                <Box shadow="dark-lg" my="1.7rem" mx="auto">
                                    <Chart
                                        chartType="LineChart"
                                        width="100%"
                                        height="420px"
                                        data={sizeData}
                                        options={option2}
                                    />
                                </Box>
                            }
                        </Box>
                    </Flex>
                </Box>

            </Box>
        </>
    )
}

