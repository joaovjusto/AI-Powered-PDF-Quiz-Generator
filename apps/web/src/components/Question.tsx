'use client'

import {
  Box,
  VStack,
  Text,
  Input,
  Divider,
  InputGroup,
  Textarea,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useQuizStore } from '@/store/quiz'

interface QuestionProps {
  number: number
  question: string
  options: string[]
  correctIndex: number
}

export function Question({ number, question, options, correctIndex }: QuestionProps) {
  const { questions, setQuestions } = useQuizStore()
  const isMobile = useBreakpointValue({ base: true, md: false })

  const updateQuestion = (newQuestion: string) => {
    if (!questions) return

    const updatedQuestions = [...questions]
    updatedQuestions[number - 1] = {
      ...updatedQuestions[number - 1],
      question: newQuestion
    }
    setQuestions(updatedQuestions)
  }

  const updateOption = (optionIndex: number, newValue: string) => {
    if (!questions) return

    const updatedQuestions = [...questions]
    const updatedOptions = [...updatedQuestions[number - 1].options]
    updatedOptions[optionIndex] = newValue
    
    updatedQuestions[number - 1] = {
      ...updatedQuestions[number - 1],
      options: updatedOptions
    }
    setQuestions(updatedQuestions)
  }

  // Sincroniza o estado inicial com o store
  useEffect(() => {
    if (!questions) return

    const currentQuestion = questions[number - 1]
    if (currentQuestion.question !== question || 
        JSON.stringify(currentQuestion.options) !== JSON.stringify(options)) {
      const updatedQuestions = [...questions]
      updatedQuestions[number - 1] = {
        ...updatedQuestions[number - 1],
        question,
        options
      }
      setQuestions(updatedQuestions)
    }
  }, [])

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
          value={questions?.[number - 1]?.question || question}
          onChange={(e) => updateQuestion(e.target.value)}
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
          {(questions?.[number - 1]?.options || options).map((option, index) => (
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
                    onChange={(e) => updateOption(index, e.target.value)}
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
                    fontSize="16px"
                    fontWeight="500"
                    color="#3E3C46"
                    _placeholder={{ color: "#3E3C46" }}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  />
                </InputGroup>
              </Box>
            </Box>
          ))}
        </VStack>
      </VStack>
    </Box>
  )
}