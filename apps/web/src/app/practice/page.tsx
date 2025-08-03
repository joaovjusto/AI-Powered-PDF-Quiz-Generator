'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Box,
  Container,
  Heading,
  Button,
  Icon,
  VStack,
  HStack,
  Text,
  Radio,
  RadioGroup,
  useToast,
} from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { useQuizStore } from '@/store/quiz'

export default function PracticePage() {
  const router = useRouter()
  const toast = useToast()
  const { questions = [], metadata } = useQuizStore()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verifica se temos questões carregadas
    if (!questions || questions.length === 0) {
      router.push('/')
      return
    }
    setIsLoading(false)
  }, [questions, router])

  const handleBack = () => {
    router.push('/edit')
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedAnswer('')
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setSelectedAnswer('')
    }
  }

  if (isLoading) {
    return null
  }

  const question = questions[currentQuestion]

  return (
    <Box w="full" h="100vh" display="flex" flexDirection="column" bg="#F8F8F9" overflow="hidden">
      {/* Header */}
      <Box w="full" bg="#F8F8F9">
        <Box py={4} pl={8}>
          <HStack spacing={3} align="center">
            <Button
              variant="ghost"
              onClick={handleBack}
              minW="48px"
              h="48px"
              p={0}
              _hover={{ bg: 'transparent' }}
            >
              <Icon as={ChevronLeftIcon} color="#15112B80" boxSize="24px" />
            </Button>

            <HStack spacing={2} align="center">
              <Image
                src="/pdf.svg"
                alt="PDF Icon"
                width={24}
                height={24}
                style={{ objectFit: 'contain' }}
              />
              <Text
                fontSize="24px"
                color="#6E6B7B"
                fontWeight="600"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {metadata?.topic || 'Untitled Topic'}
              </Text>
            </HStack>
          </HStack>
        </Box>


      </Box>

      {/* Main Content */}
      <Box flex="1" position="relative">
        <Container maxW="4xl" px={4} pt={4}>
          <Box
            bg="white"
            borderRadius="12px"
            p="20px"
            border="1px solid"
            borderColor="#41414114"
          >
            <VStack spacing={6} align="stretch">
              {/* Question Number */}
              <Text 
                fontSize="18px" 
                color="#3E3C46" 
                fontWeight="500"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Question {currentQuestion + 1}
              </Text>

              {/* Question Text */}
              <Box
                bg="#98989814"
                border="1px solid"
                borderColor="#D9D9D91F"
                p="20px"
                borderRadius="8px"
              >
                <Text 
                  fontSize="20px" 
                  color="#3E3C46" 
                  fontWeight="500"
                  lineHeight="1.6"
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  {question.question}
                </Text>
              </Box>

              <Box 
                height="1px" 
                bg="#0000001A" 
                width="100%" 
                my={2}
              />

              {/* Options */}
              <RadioGroup value={selectedAnswer} onChange={setSelectedAnswer}>
                <VStack spacing={4} align="stretch">
                  {question.options.map((option, index) => (
                    <Box
                      key={index}
                      bg="#98989814"
                      border="1px solid"
                      borderColor="#D9D9D91F"
                      p="20px"
                      borderRadius="8px"
                      width="100%"
                    >
                      <Radio
                        value={index.toString()}
                        size="lg"
                        colorScheme="purple"
                        borderColor="#D9D9D9"
                        width="100%"
                      >
                        <Text 
                          fontSize="18px" 
                          color="#3E3C46" 
                          fontWeight="500"
                          style={{ fontFamily: 'var(--font-inter)' }}
                          ml={2}
                        >
                          {option}
                        </Text>
                      </Radio>
                    </Box>
                  ))}
                </VStack>
              </RadioGroup>
            </VStack>
          </Box>
        </Container>

        {/* Navigation Buttons */}
        <Box position="absolute" bottom="40px" left="0" right="0" px={4}>
          <Container maxW="4xl">
            <HStack spacing={4} justify="space-between">
              <Button
                onClick={handlePrevious}
                isDisabled={currentQuestion === 0}
                variant="outline"
                borderColor="#6D56FA"
                color="#6D56FA"
                _hover={{ bg: 'transparent', borderColor: '#5842E8', color: '#5842E8' }}
                height="50px"
                px="32px"
                fontSize="16px"
                fontWeight="500"
                borderRadius="12px"
                style={{ fontFamily: 'var(--font-inter)' }}
                size="lg"
              >
                <Icon as={ChevronLeftIcon} boxSize={5} mr={2} />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                isDisabled={currentQuestion === questions.length - 1}
                bg="#6D56FA"
                color="white"
                _hover={{ bg: '#5842E8' }}
                height="50px"
                px="32px"
                fontSize="16px"
                fontWeight="500"
                borderRadius="12px"
                style={{ fontFamily: 'var(--font-inter)' }}
                size="lg"
              >
                Next
                <Icon as={ChevronRightIcon} boxSize={5} ml={2} />
              </Button>
            </HStack>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}