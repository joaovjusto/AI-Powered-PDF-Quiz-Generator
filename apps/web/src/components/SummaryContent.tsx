'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Box,
  Container,
  Button,
  Icon,
  HStack,
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { useQuizStore } from '@/store/quiz'

export function SummaryContent() {
  const router = useRouter()
  const { metadata, userName, questions, userAnswers, loadCachedResults, saveResults } = useQuizStore()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadResults() {
      try {
        // Se não temos dados, tenta carregar do cache
        if (!questions.length || !userName || !userAnswers.length) {
          const hasCache = await loadCachedResults()
          if (!hasCache) {
            router.push('/')
            return
          }
        } else {
          // Se temos dados, salva no cache e limpa o cache de questões
          await saveResults()
        }
      } catch (error) {
        console.error('Error loading results:', error)
        router.push('/')
        return
      }
      setIsLoading(false)
    }

    loadResults()
  }, [questions.length, userName, userAnswers.length, loadCachedResults, saveResults, router])
  
  const correctAnswers = userAnswers.reduce((acc, answer, index) => {
    return acc + (answer === questions[index].correct_index ? 1 : 0)
  }, 0)
  
  const totalQuestions = questions.length
  const score = `${correctAnswers}/${totalQuestions}`
  const isGoodScore = correctAnswers >= Math.floor(totalQuestions * 0.7) // 70% or better is good

  const handleBack = () => {
    router.push('/practice')
  }

  if (isLoading) {
    return null
  }

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
            position="relative"
            height="100%"
            overflow="hidden"
          >
            <Box
              height="100%"
              overflowY="auto"
              pr={4}
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
                {/* Score Card */}
                <Box textAlign="center">
                  {isGoodScore && (
                    <Box mb={4} display="flex" justifyContent="center">
                      <Image
                        src="/correctanswer.svg"
                        alt="Success Icon"
                        width={48}
                        height={48}
                      />
                    </Box>
                  )}
                  <Text
                    fontSize="24px"
                    color="#3E3C46"
                    fontWeight="600"
                    mb={4}
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {isGoodScore
                      ? `Great Work ${userName}, you did very good on your quiz.`
                      : `Keep practicing ${userName}, you can do better!`}
                  </Text>
                  <Text
                    fontSize="36px"
                    color="#3E3C46"
                    fontWeight="700"
                    style={{ fontFamily: 'var(--font-inter)' }}
                  >
                    {score}
                  </Text>
                </Box>
              </Box>

              {/* Result Summary Section */}
              <Box mt={8}>
                <Text
                  fontSize="20px"
                  color="#3E3C46"
                  fontWeight="600"
                  mb={4}
                  style={{ fontFamily: 'var(--font-inter)' }}
                >
                  Result Summary
                </Text>
                                <Accordion 
                  allowToggle 
                  index={expandedIndex} 
                  onChange={(index) => setExpandedIndex(Array.isArray(index) ? index[0] : index)}
                >
                  {questions.map((question, index) => (
                    <AccordionItem key={index} border="none" mb={2}>
                      {({ isExpanded }) => (
                        <>
                          <Box 
                            bg="white" 
                            borderRadius={isExpanded ? "12px 12px 0 0" : "12px"}
                            p="20px"
                            border="1px solid"
                            borderColor="#3E3C461F"
                            borderBottom={isExpanded ? "none" : "1px solid #3E3C461F"}
                          >
                            <AccordionButton
                              p={0}
                              _hover={{ bg: 'transparent' }}
                            >
                              <VStack spacing={4} align="stretch" width="100%">
                                <HStack justify="space-between" width="100%">
                                  <Text
                                    fontSize="16px"
                                    color="#3E3C46"
                                    fontWeight="500"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                  >
                                    Question {index + 1}
                                  </Text>
                                  <Box
                                    px={3}
                                    py={1}
                                    borderRadius="8px"
                                    bg={userAnswers[index] === question.correct_index ? "#ECFDF3" : "#FF505014"}
                                    border="1px solid"
                                    borderColor={userAnswers[index] === question.correct_index ? "#ABEFC6" : "#FF625880"}
                                  >
                                    <Text
                                      fontSize="14px"
                                      color={userAnswers[index] === question.correct_index ? "#009758" : "#FF5050"}
                                      fontWeight="500"
                                      style={{ fontFamily: 'var(--font-inter)' }}
                                    >
                                      {userAnswers[index] === question.correct_index ? "Correct Answer" : "Wrong Answer"}
                                    </Text>
                                  </Box>
                                </HStack>
                                {!isExpanded && (
                                  <>
                                    <Box height="1px" bg="#0000001A" width="100%" />
                                    <Text
                                      fontSize="16px"
                                      color="#3E3C46"
                                      fontWeight="400"
                                      style={{ fontFamily: 'var(--font-inter)' }}
                                      textAlign="left"
                                      width="100%"
                                    >
                                      {question.question}
                                    </Text>
                                  </>
                                )}
                              </VStack>
                            </AccordionButton>
                          </Box>
                          <Box
                            bg="white"
                            borderRadius="0 0 12px 12px"
                            border="1px solid"
                            borderColor="#3E3C461F"
                            borderTop="none"
                          >
                            <AccordionPanel pt={4} pb={4} px={5}>
                              <VStack spacing={6} align="stretch">
                                <Box
                                  bg="#98989814"
                                  borderRadius="12px"
                                  border="1px solid"
                                  borderColor="#D9D9D91F"
                                  p={4}
                                >
                                  <Text
                                    fontSize="16px"
                                    color="#3E3C46"
                                    fontWeight="400"
                                    style={{ fontFamily: 'var(--font-inter)' }}
                                  >
                                    {question.question}
                                  </Text>
                                </Box>
                                {question.options.map((option, optionIndex) => (
                                  <Box
                                    key={optionIndex}
                                    bg={
                                      optionIndex === question.correct_index ? "#ECFDF3" :
                                      userAnswers[index] === optionIndex ? "#FF505014" : 
                                      "#F8F8F9"
                                    }
                                    borderRadius="8px"
                                    p={4}
                                    display="flex"
                                    alignItems="center"
                                  >
                                    <Box
                                      w="20px"
                                      h="20px"
                                      borderRadius="full"
                                      border="2px solid"
                                      borderColor={
                                        optionIndex === question.correct_index ? "#009758" :
                                        userAnswers[index] === optionIndex ? "#FF5050" : 
                                        "#D9D9D9"
                                      }
                                      mr={3}
                                      position="relative"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      {(userAnswers[index] === optionIndex || optionIndex === question.correct_index) && (
                                        <Box
                                          w="10px"
                                          h="10px"
                                          borderRadius="full"
                                          bg={optionIndex === question.correct_index ? "#009758" : "#FF5050"}
                                        />
                                      )}
                                    </Box>
                                    <HStack justify="space-between" width="100%">
                                      <Text
                                        fontSize="16px"
                                        color="#3E3C46"
                                        style={{ fontFamily: 'var(--font-inter)' }}
                                      >
                                        {option}
                                      </Text>
                                      {(userAnswers[index] === optionIndex || optionIndex === question.correct_index) && (
                                        <Text
                                          fontSize="14px"
                                          color={optionIndex === question.correct_index ? "#009758" : "#FF5050"}
                                          fontWeight="500"
                                          style={{ fontFamily: 'var(--font-inter)' }}
                                        >
                                          {optionIndex === question.correct_index ? "Correct Answer" : "Wrong Answer"}
                                        </Text>
                                      )}
                                    </HStack>
                                  </Box>
                                ))}
                              </VStack>
                            </AccordionPanel>
                          </Box>
                        </>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
              </Box>
            </Box>

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
        </Container>
      </Box>
    </Box>
  )
}