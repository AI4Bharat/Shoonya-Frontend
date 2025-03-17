// "use client";

// import React from "react";
// import {
//   Box,
//   chakra,
//   Container,
//   Text,
//   HStack,
//   VStack,
//   Flex,
//   useColorModeValue,
//   useBreakpointValue,
// } from "@chakra-ui/react";

// interface Release {
//   version: string;
//   release_date: string;
//   features_list: Array<string>;
// }

// const LineWithDot = () => {
//   return (
//     <Flex
//       pos="relative"
//       alignItems="center"
//       mr={{ base: "40px", md: "40px" }}
//       ml={{ base: "0", md: "40px" }}
//     >
//       <chakra.span
//         position="absolute"
//         left="50%"
//         height="calc(100% + 10px)"
//         border="1px solid"
//         borderColor={useColorModeValue("gray.200", "gray.700")}
//         top="0px"
//       ></chakra.span>
//       <Box pos="relative" p="10px">
//         <Box
//           pos="absolute"
//           top="0"
//           left="0"
//           bottom="0"
//           right="0"
//           width="100%"
//           height="100%"
//           backgroundSize="cover"
//           backgroundRepeat="no-repeat"
//           backgroundPosition="center center"
//           bg={useColorModeValue("gray.600", "gray.200")}
//           borderRadius="100px"
//           backgroundImage="none"
//           opacity={1}
//         ></Box>
//       </Box>
//     </Flex>
//   );
// };

// const EmptyCard = () => {
//   return (
//     <Box
//       flex={{ base: 0, md: 1 }}
//       p={{ base: 0, md: 6 }}
//       bg="transparent"
//     ></Box>
//   );
// };

// const Card = ({ release, index }: { release: Release; index: number }) => {
//   // For even id show card on left side
//   // For odd id show card on right side
//   const isEvenId = index % 2 == 0;
//   let borderWidthValue = isEvenId ? "15px 15px 15px 0" : "15px 0 15px 15px";
//   let leftValue = isEvenId ? "-15px" : "unset";
//   let rightValue = isEvenId ? "unset" : "-15px";

//   const isMobile = useBreakpointValue({ base: true, md: false });
//   if (isMobile) {
//     leftValue = "-15px";
//     rightValue = "unset";
//     borderWidthValue = "15px 15px 15px 0";
//   }

//   return (
//     <HStack
//       flex={1}
//       p={{ base: 3, sm: 6 }}
//       bg={useColorModeValue("gray.100", "gray.800")}
//       spacing={5}
//       rounded="lg"
//       alignItems="center"
//       pos="relative"
//       _before={{
//         content: `""`,
//         w: "0",
//         h: "0",
//         borderColor: `transparent ${useColorModeValue(
//           "#edf2f6",
//           "#1a202c"
//         )} transparent`,
//         borderStyle: "solid",
//         borderWidth: borderWidthValue,
//         position: "absolute",
//         left: leftValue,
//         right: rightValue,
//         display: "block",
//       }}
//     >
//       <Box>
//         <Text fontSize="lg" color={isEvenId ? "teal.400" : "blue.400"}>
//           {release.release_date}
//         </Text>

//         <VStack spacing={1} mb={3} textAlign="left">
//           <Text fontSize="2xl" lineHeight={1.2} fontWeight="bold" w="100%">
//             {release.version}
//           </Text>
//           <chakra.ul>
//             {release.features_list.map((feature) => (
//               <chakra.li
//                 fontSize="medium"
//                 lineHeight={1.2}
//                 fontWeight="bold"
//                 w="100%"
//               >
//                 {feature}
//               </chakra.li>
//             ))}
//           </chakra.ul>
//         </VStack>
//       </Box>
//     </HStack>
//   );
// };

// export default function Timeline({
//   release_timeline_json,
// }: {
//   release_timeline_json: Array<Release>;
// }) {
//   const isMobile = useBreakpointValue({ base: true, md: false });
//   const isDesktop = useBreakpointValue({ base: false, md: true });

//   return (
//     <Container maxWidth="7xl" p={{ base: 2, sm: 10 }}>
//       <chakra.h3 fontSize="4xl" fontWeight="bold" mb={18} textAlign="center">
//         Release Timeline
//       </chakra.h3>
//       {release_timeline_json.map((release, index) => (
//         <Flex key={release.version} mb="10px">
//           {/* Desktop view(left card) */}
//           {isDesktop && index % 2 === 0 && (
//             <>
//               <EmptyCard />
//               <LineWithDot />
//               <Card release={release} index={index} />
//             </>
//           )}

//           {/* Mobile view */}
//           {isMobile && (
//             <>
//               <LineWithDot />
//               <Card release={release} index={index} />
//             </>
//           )}

//           {/* Desktop view(right card) */}
//           {isDesktop && index % 2 !== 0 && (
//             <>
//               <Card release={release} index={index} />

//               <LineWithDot />
//               <EmptyCard />
//             </>
//           )}
//         </Flex>
//       ))}
//     </Container>
//   );
// }
