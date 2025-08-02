'use client'

import {
  Box,
  VStack,
  Text,
  Input,
  Divider,
  InputGroup,
  InputRightElement,
  Flex,
  Textarea,
  useBreakpointValue,
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { useState } from 'react'

interface QuestionProps {
  number: number
  question: string
  options: string[]
  correctIndex: number
}

export function Question({ number, question, options, correctIndex }: QuestionProps) {
  const [editableOptions, setEditableOptions] = useState(options)
  const [editableQuestion, setEditableQuestion] = useState(question)
  const isMobile = useBreakpointValue({ base: true, md: false })

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...editableOptions]
    newOptions[index] = value
    setEditableOptions(newOptions)
  }

  return (
    <Box
      bg="#FFFFFF"
      p="20px"
      borderRadius="12px"
      border="1px solid"
      borderColor="rgba(65, 65, 65, 0.08)"
      mb={2}
      width="100%"
    >
      <VStack align="stretch" spacing={4} width="100%">
        {/* Question Number */}
        <Text 
          fontSize="14px" 
          color="#3E3C46" 
          fontWeight="500"
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Question {number}:
        </Text>
        
        {/* Question Textarea */}
        <Textarea
          value={editableQuestion}
          onChange={(e) => setEditableQuestion(e.target.value)}
          minH="88px"
          p="20px"
          width="100%"
          bg="rgba(152, 152, 152, 0.08)"
          border="1px solid rgba(217, 217, 217, 0.12)"
          borderRadius="12px"
          fontSize="16px"
          color="#3E3C46"
          fontWeight="500"
          resize="none"
          _hover={{ borderColor: "rgba(217, 217, 217, 0.12)" }}
          _focus={{ 
            borderColor: "rgba(217, 217, 217, 0.12)",
            boxShadow: "none"
          }}
          style={{ 
            fontFamily: 'var(--font-inter)',
            padding: '20px',
          }}
        />

        {/* Divider with 10% opacity */}
        <Divider 
          borderColor="black" 
          opacity={0.1} 
          my={4}
        />

        {/* Multichoice Answers Title */}
        <Text 
          fontSize="14px" 
          color="#3E3C46" 
          fontWeight="500"
          mb={4}
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          Multichoice Answers
        </Text>

        {/* Editable Options */}
        <VStack spacing={4} align="stretch">
          {editableOptions.map((option, index) => (
            <Box 
              key={index}
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              alignItems={{ base: "flex-start", md: "center" }}
              gap={{ base: 2, md: 4 }}
            >
              <Text 
                fontSize="14px"
                color="#3E3C46"
                fontWeight="500"
                minW={{ base: "auto", md: "80px" }}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Option {index + 1}:
              </Text>
              <Box width={{ base: "100%", md: "auto" }} flex={1}>
                <InputGroup size="lg">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    height="50px"
                    bg="#F8F8F9"
                    borderRadius="12px"
                    border={isMobile && index === correctIndex ? "1px solid #ABEFC6" : "none"}
                    width="100%"
                    _hover={{ 
                      border: isMobile && index === correctIndex ? "1px solid #ABEFC6" : "none"
                    }}
                    _focus={{ 
                      border: isMobile && index === correctIndex ? "1px solid #ABEFC6" : "1px solid rgba(109, 86, 250, 0.2)",
                      boxShadow: 'none',
                      bg: '#F4F2FF'
                    }}
                    px="20px"
                    pr={!isMobile && index === correctIndex ? "150px" : "20px"}
                    fontSize="16px"
                    fontWeight="500"
                    color="#3E3C46"
                    _placeholder={{ color: "#3E3C46" }}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                  {!isMobile && index === correctIndex && (
                    <InputRightElement width="auto" pr={2} height="50px">
                      <Flex
                        boxSizing="border-box"
                        display="flex"
                        flexDirection="row"
                        justifyContent="center"
                        alignItems="center"
                        padding="8px 10px"
                        gap="6px"
                        width="132px"
                        height="32px"
                        bg="#ECFDF1"
                        border="1px solid #ABEFC6"
                        borderRadius="8px"
                        flexGrow={0}
                        margin="0 auto"
                      >
                        <CheckIcon boxSize={3} color="#28AD75" />
                        <Text
                          color="#28AD75"
                          fontSize="12px"
                          fontWeight="500"
                          lineHeight="normal"
                          style={{ fontFamily: 'var(--font-inter)' }}
                        >
                          Correct Answer
                        </Text>
                      </Flex>
                    </InputRightElement>
                  )}
                </InputGroup>
              </Box>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  )
}