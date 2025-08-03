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
import { ChevronLeftIcon } from '@chakra-ui/icons'
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
          <HStack spacing={6} align="center">
            <Button
              variant="ghost"
              onClick={handleBack}
              minW="40px"
              h="40px"
              p={0}
              _hover={{ bg: 'transparent' }}
            >
              <Icon as={ChevronLeftIcon} color="#15112B80" boxSize={6} />
            </Button>

            <HStack spacing={2} align="center">
              <Image
                src="/pdf.svg"
                alt="PDF Icon"
                width={20}
                height={20}
                style={{ objectFit: 'contain' }}
              />
              <Text
                fontSize="14px"
                color="#15112B80"
                fontWeight="500"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                {metadata?.topic || 'Untitled Topic'}
              </Text>
            </HStack>
          </HStack>
        </Box>

        <Container maxW="4xl" px={4}>
          <Box py={4}>
            <HStack spacing={3} alignItems="center">
              <Image
                src="/logo.svg"
                alt="Unstuck Quiz Generator Logo"
                width={31}
                height={29}
                style={{ objectFit: 'contain' }}
              />
              <Heading
                as="h1"
                fontSize={{ base: '24px', md: '32px' }}
                fontWeight="500"
                color="#3E3C46"
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Mathematics Quiz
              </Heading>
            </HStack>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box flex="1" position="relative">
        <Container maxW="4xl" px={4} height="100%">
          <VStack spacing={6} align="stretch">
            {/* Question Number */}
            <Text fontSize="16px" color="#6D56FA" fontWeight="500" mt={4}>
              Question {currentQuestion + 1}
            </Text>

            {/* Question Text */}
            <Text fontSize="18px" color="#15112B" fontWeight="500" lineHeight="1.6">
              {question.question}
            </Text>

            {/* Options */}
            <RadioGroup value={selectedAnswer} onChange={setSelectedAnswer}>
              <VStack spacing={4} align="stretch">
                {question.options.map((option, index) => (
                  <Radio
                    key={index}
                    value={index.toString()}
                    size="lg"
                    colorScheme="purple"
                    borderColor="#D9D9D9"
                  >
                    <Text fontSize="16px" color="#15112B" ml={2}>
                      {option}
                    </Text>
                  </Radio>
                ))}
              </VStack>
            </RadioGroup>
          </VStack>
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
              >
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
              >
                Next
              </Button>
            </HStack>
          </Container>
        </Box>
      </Box>
    </Box>
  )
}