import "./../../App.scss"
import { useEffect, useRef, useState } from "react"
import { retriveData } from "../../utils/localStorage"
import { Card, CardBody, Heading, Text, Image, Icon, Stack, useMediaQuery, Center, Tabs, Tab, TabList } from "@chakra-ui/react";
import { Box, SimpleGrid } from "@chakra-ui/react"
import { MainUrl } from "../../../variables"
export const AllImages = () => {
    let screenSize = useMediaQuery()
    let [imagesArray, setImagesArray] = useState(null);
    let [data, setData] = useState(null)
    let [graphData, setGraphData] = useState(null)
    let [imageReady, setImagesReady] = useState(false);
    let [loading, setLoading] = useState(true)
    const [user, changeUser] = useState(retriveData("PData"))
    const [phase, setNewPhase] = useState("1")

    async function fetchImages(url) {
        try {
            const response = await fetch(url);
            const result = await response.json();
            if (result.success) {
                setImagesArray(result.body.images)
                setImagesReady(true)
            } else {
                setImagesReady(false);
            }
        } catch (error) {

        }

    }

    useEffect(() => {
        let url = `${MainUrl}data/images/${phase}`;
        fetchImages(url);
    }, [phase])
    return (
        <>

            <Box py={5}>
                <Center>
                    <Tabs onChange={(e) => setNewPhase(e)} boxShadow='dark-lg'>
                        <TabList>
                            <Tab _selected={{ color: 'white', bg: 'blue.500' }}>Phase 1</Tab>
                            <Tab _selected={{ color: 'white', bg: 'green.400' }}>Phase 2</Tab>
                            <Tab _selected={{ color: 'white', bg: 'green.400' }}>Phase 3</Tab>
                        </TabList>
                    </Tabs>
                </Center>
            </Box>

            {
                imageReady &&
                <Box mx="auto" py="2rem" width={{ base: '100%', sm: '80%', md: '70%' }} px={screenSize.width < 600 ? '2' : '0'}>
                    <Text color="#023047" py="1.1rem" textDecoration="underline" fontWeight="bold" fontSize="1.5rem" >Captured Pictures.</Text>
                    <Box>
                        <SimpleGrid
                            backgroundColor=""
                            columns={{ sm: 2, md: 3 }}
                            spacing='10'
                            px={screenSize.width < 600 ? '2' : '0'}
                            color='inherit'
                        >
                            {imagesArray?.map((img, index) => (
                                <Box key={index}>
                                    <Card maxW='sm' mt="0rem" shadow="2xl">
                                        <CardBody>
                                            <Image
                                                src={`${MainUrl}${img?.imgPath}`}
                                                height="60%"
                                                alt='Captured. pictures'
                                                borderRadius='lg'
                                            />
                                            <Stack mt='2' spacing='3'>
                                                <Heading color="#023047" size='md'>Date: {img?.createdAt?.slice(0, 10)}</Heading>
                                                <Heading color="#023047" size='md'> Time: {img?.createdAt?.slice(11, 16)}  Hrs </Heading>

                                            </Stack>
                                        </CardBody>

                                    </Card>

                                </Box>
                            ))}
                        </SimpleGrid>

                    </Box>

                </Box>
            }

        </>
    )
}