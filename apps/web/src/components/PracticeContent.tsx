'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Box,
  Container,
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

export function PracticeContent() {
  const router = useRouter()
  const toast = useToast()
  const { questions = [], metadata, setUserName, setUserAnswers, saveResults } = useQuizStore()
  const [answers, setAnswers] = useState<number[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const scrollableContainerRef = useRef<HTMLDivElement>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [userName, setUserNameLocal] = useState('')
  const [showNameInput, setShowNameInput] = useState(false)

  useEffect(() => {
    if (!questions || questions.length === 0) {
      router.push('/')
      return
    }
    setIsLoading(false)
  }, [questions, router])

  const handleBack = () => {
    router.push('/edit')
  }

  const handleNext = async () => {
    if (showNameInput) {
      if (!userName.trim()) {
        toast({
          title: "Please enter your name",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      setUserName(userName.trim());
      await saveResults();
      router.push('/summary');
      return;
    }

    if (!selectedAnswer) return;

    const question = questions[currentQuestion];
    const selectedIdx = parseInt(selectedAnswer);
    const isAnswerCorrect = selectedIdx === question.correct_index;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedIdx;
      setAnswers(newAnswers);
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer('');
        setShowFeedback(false);
      } else {
        setUserAnswers(newAnswers);
        setShowNameInput(true);
        setShowFeedback(false);
      }
    }, 1500);
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
  const isLastStep = currentQuestion === questions.length - 1 && showNameInput

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
      <Box flex="1" position="relative" overflow="hidden">
        <Container 
          maxW="4xl" 
          px={4}
          pt={4}
          position="relative"
          height="100%"
          overflow="hidden"
        >
          <Box
            ref={scrollableContainerRef}
            height="100%"
            overflowY="auto"
            pb={{ base: "120px", md: 0 }}
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: '#FFFFFF',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#F5F5F5',
                borderRadius: '10px',
                border: '2px solid #FFFFFF',
                backgroundClip: 'padding-box',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: '#000',
                borderRadius: '4px',
                border: '1px solid #6D56FA',
              },
              scrollbarWidth: 'auto',
              scrollbarColor: '#F5F5F5 #FFFFFF',
              msOverflowStyle: 'none',
              backgroundAttachment: 'local',
            }}
          >
            <Box
              bg="white"
              borderRadius="12px"
              p="20px"
              border="1px solid"
              borderColor="#41414114"
            >
              <VStack spacing={6} align="stretch">
                {!showNameInput && (
                  <Text 
                    fontSize="18px" 
                    color="#3E3C46" 
                    fontWeight="500"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    Question {currentQuestion + 1}
                  </Text>
                )}
                {showNameInput ? (
                  <>
                    {/* Name Input */}
                    <Box
                      bg="#98989814"
                      border="1px solid"
                      borderColor="#D9D9D91F"
                      p="20px"
                      borderRadius="8px"
                    >
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserNameLocal(e.target.value)}
                        placeholder="Enter your first name"
                        style={{
                          width: '100%',
                          padding: '12px',
                          fontSize: '16px',
                          border: '1px solid #D9D9D9',
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          color: '#3E3C46',
                          fontFamily: 'var(--font-inter)',
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </VStack>
            </Box>

            {/* Feedback Chip */}
            {showFeedback && (
              <Box mt={{ base: 2, md: 4 }}>
                <Box 
                  bg={isCorrect ? "#ECFDF3" : "#FF505014"}
                  border="1px solid"
                  borderColor={isCorrect ? "#009758" : "#FF5050"}
                  borderRadius="16px"
                  px={{ base: "12px", md: "20px" }}
                  py={{ base: "8px", md: "16px" }}
                  width="100%"
                  display="flex"
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  {isCorrect && (
                    <Image
                      src="/correctanswer.svg"
                      alt="Correct Answer Icon"
                      width={26}
                      height={26}
                      style={{ marginRight: '8px' }}
                    />
                  )}
                  <Text
                    fontSize={{ base: "14px", md: "26px" }}
                    fontWeight="600"
                    color={isCorrect ? "#009758" : "#FF5050"}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {isCorrect ? "Correct!" : "Wrong!"}
                  </Text>
                </Box>
              </Box>
            )}

            {/* Fade Out Effect */}
            <Box
              display={{ base: 'block', md: 'none' }}
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              height="120px"
              pointerEvents="none"
              background="linear-gradient(to bottom, rgba(248, 248, 249, 0) 0%, rgba(248, 248, 249, 0.8) 40%, rgba(248, 248, 249, 0.95) 70%, rgba(248, 248, 249, 1) 100%)"
              zIndex={1}
            />
          </Box>

          {/* Navigation Buttons */}
          <Box 
            position="absolute" 
            bottom={{ base: "20px", md: "40px" }} 
            left="0" 
            right="0" 
            px={4}
            bg={{ base: "#F8F8F9", md: "transparent" }}
            zIndex={2}
          >
            <Container maxW="4xl">
              <HStack spacing={4} justify="space-between">
                <Button
                  onClick={handlePrevious}
                  isDisabled={currentQuestion === 0}
                  variant="outline"
                  borderColor="#6D56FA"
                  color="#6D56FA"
                  _hover={{ bg: 'transparent', borderColor: '#5842E8', color: '#5842E8' }}
                  height={{ base: "36px", md: "50px" }}
                  px={{ base: "16px", md: "32px" }}
                  fontSize={{ base: "12px", md: "16px" }}
                  fontWeight="500"
                  borderRadius="12px"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  size={{ base: "md", md: "lg" }}
                >
                  <Icon as={ChevronLeftIcon} boxSize={{ base: 4, md: 5 }} mr={2} />
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  isDisabled={showNameInput ? !userName.trim() : !selectedAnswer}
                  bg="#6D56FA"
                  color="white"
                  _hover={{ bg: '#5842E8' }}
                  height={{ base: "36px", md: "50px" }}
                  px={{ base: "16px", md: "32px" }}
                  fontSize={{ base: "12px", md: "16px" }}
                  fontWeight="500"
                  borderRadius="12px"
                  style={{ fontFamily: 'var(--font-inter)' }}
                  size="lg"
                >
                  {showNameInput ? 'Save & Continue' : 'Next'}
                  <Icon as={ChevronRightIcon} boxSize={{ base: 4, md: 5 }} ml={2} />
                </Button>
              </HStack>
            </Container>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}