import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Tag, Text, VStack } from '@chakra-ui/react'
import { useFormik } from 'formik';
import { useState } from 'react';


function App() {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pnrData, setPnrData] = useState(null);

  const formik = useFormik({
    initialValues: {
      pnrNumber: "",
      contactId: "",
    },
    onSubmit: async (values) => {

      if (!values.contactId || !values.contactId) {
        alert("Please input ticket number and contact id");
        return;
      }

      setIsSubmitting(true)
      const res = await fetch("http://glb.ticketsimply.com//api/cms_booking_engine.json", {
        "headers": {
          "accept": "*/*",
          "accept-language": "en-US,en;q=0.9,ml;q=0.8",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        "referrer": "http://www.glbus.in/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `query=q12&pnr_number=${values.pnrNumber}&email=${values.contactId}`,
        "method": "POST",
        "mode": "cors",
        "credentials": "omit"
      });

      const responseJson = await res.json();

      setIsSubmitting(false)


      if (responseJson['code'] && responseJson['code'] === 419) {
        alert(responseJson['message']);
        return
      }

      const onward = responseJson['onward'];

      if (!onward) {
        alert("Unable to get the response please check ticket number")
        return;
      }

      setPnrData({
        origin: onward.origin,
        destination: onward.destination,
        boarding: `${onward.boarding_details.address}(${onward.boarding_details.landmark})`,
        starting: `${onward.travel_date} - ${onward.boarding_details.dep_time}`,
        seatNumbers: onward.seat_numbers,
        serviceNumber: onward.service_number
      })

      console.log(responseJson)
    }
  });
  return (
    <>
      <Flex bg="gray.100" justify="center" h="100vh">
        <VStack>
          <Box bg="white" p={6} rounded="md" mt={10}>
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="flex-start">
                <FormControl>
                  <FormLabel htmlFor="pnrNumber">Ticket Number</FormLabel>
                  <Input
                    id="pnrNumber"
                    name="pnrNumber"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.pnrNumber}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="contactId">Email/Phone Number</FormLabel>
                  <Input
                    id="contactId"
                    name="contactId"
                    type="text"
                    variant="filled"
                    onChange={formik.handleChange}
                    value={formik.values.contactId}
                  />
                </FormControl>
                <Button type="submit" colorScheme="purple" width="full" isDisabled={isSubmitting}>
                  Login
                </Button>
              </VStack>
            </form>
          </Box>

          {pnrData && <Box bg="white" p={6} rounded="md" m={4} alignItems="le">
            <VStack spacing={4} align="baseline">
              <HStack>
                <Tag>Origin</Tag><Text fontSize='md'>{pnrData?.origin}</Text>
              </HStack>
              <HStack>
                <Tag>Destination</Tag><Text fontSize='md'>{pnrData?.destination}</Text>
              </HStack>
              <HStack>
                <Tag>Boarding</Tag><Text fontSize='md'>{pnrData?.boarding}</Text>
              </HStack>
              <HStack>
                <Tag>Starting</Tag><Text fontSize='md'>{pnrData?.starting}</Text>
              </HStack>
              <HStack>
                <Tag>Seat numbers</Tag><Text fontSize='md'>{pnrData?.seatNumbers}</Text>
              </HStack>
              <HStack>
                <Tag>Service No</Tag><Text fontSize='md'>{pnrData?.serviceNumber}</Text>
              </HStack>
            </VStack>
          </Box>}
        </VStack>

      </Flex >
    </>
  )
}

export default App
