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
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { useState, useEffect, useRef } from 'react'

interface QuestionProps {
  number: number
  question: string
  options: string[]
  correctIndex: number
}

export function Question({ number, question, options, correctIndex }: QuestionProps) {
  const [editableOptions, setEditableOptions] = useState(options)
  const [editableQuestion, setEditableQuestion] = useState(question)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.max(88, textareaRef.current.scrollHeight)}px`
    }
  }, [editableQuestion])

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
        
        {/* Textarea da Questão */}
        <Textarea
          ref={textareaRef}
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

        {/* Divider com 10% de opacidade */}
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

        {/* Opções editáveis */}
        <VStack spacing={4} align="stretch">
          {editableOptions.map((option, index) => (
            <Box 
              key={index}
              display="flex"
              alignItems="center"
              gap={4}
            >
              <Text 
                fontSize="14px"
                color="#3E3C46"
                fontWeight="500"
                minW="80px"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Option {index + 1}:
              </Text>
              <InputGroup size="lg">
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  height="50px"
                  bg="#F8F8F9"
                  borderRadius="12px"
                  border="none"
                  _hover={{ border: 'none' }}
                  _focus={{ 
                    border: '1px solid',
                    borderColor: 'rgba(109, 86, 250, 0.2)',
                    boxShadow: 'none',
                    bg: '#F4F2FF'
                  }}
                  pr="150px"
                  fontSize="16px"
                  fontWeight="500"
                  color="#3E3C46"
                  _placeholder={{ color: "#3E3C46" }}
                  style={{ fontFamily: 'var(--font-inter)' }}
                />
                {index === correctIndex && (
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
          ))}
        </VStack>
      </VStack>
    </Box>
  )
}