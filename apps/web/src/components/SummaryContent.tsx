'use client'

import { useState, useEffect, useRef } from 'react'
import html2canvas from 'html2canvas'
import ReactConfetti from 'react-confetti'
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
import { ChevronLeftIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { useQuizStore } from '@/store/quiz'

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false)
  useEffect(() => setHasMounted(true), [])
  return hasMounted ? <>{children}</> : null
}

export function SummaryContent() {
  const router = useRouter()
  const { metadata, userName, questions, userAnswers, loadCachedResults, saveResults } = useQuizStore()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const resultCardRef = useRef<HTMLDivElement>(null)
  const [cardSize, setCardSize] = useState({ width: 400, height: 300 })

  useEffect(() => {
    function updateCardSize() {
      if (resultCardRef.current) {
        setCardSize({
          width: resultCardRef.current.offsetWidth,
          height: resultCardRef.current.offsetHeight,
        })
      }
    }

    updateCardSize()

    if (typeof window !== 'undefined' && 'ResizeObserver' in window && resultCardRef.current) {
      const resizeObserver = new ResizeObserver(updateCardSize)
      resizeObserver.observe(resultCardRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  const handleShare = async () => {
    if (!resultCardRef.current) return
    try {
      setIsGeneratingImage(true)
      
      // Get the share button element
      const shareButton = resultCardRef.current.querySelector('button')
      
      // Temporarily hide the button
      if (shareButton) {
        shareButton.style.display = 'none'
      }
      
      const canvas = await html2canvas(resultCardRef.current, { backgroundColor: '#F8F8F9', scale: 2 })
      
      // Show the button again
      if (shareButton) {
        shareButton.style.display = 'flex'
      }
      
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob as Blob), 'image/png')
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `quiz-results-${userName}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  useEffect(() => {
    async function loadResults() {
      try {
        if (!questions.length || !userName || !userAnswers.length) {
          const hasCache = await loadCachedResults()
          if (!hasCache) {
            router.push('/')
            return
          }
        } else {
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

  const correctAnswers = userAnswers.reduce((acc, answer, index) => acc + (answer === questions[index].correct_index ? 1 : 0), 0)
  const totalQuestions = questions.length
  const score = `${correctAnswers}/${totalQuestions}`
  const isGoodScore = correctAnswers >= Math.floor(totalQuestions * 0.7)

  const handleBack = () => router.push('/practice')
  if (isLoading) return null

  return (
    <Box w="full" h="100vh" display="flex" flexDirection="column" bg="#F8F8F9" overflow="hidden">
      <Box w="full" bg="#F8F8F9">
        <Box py={4} pl={8}>
          <HStack spacing={3} align="center">
            <Button variant="ghost" onClick={handleBack} minW="48px" h="48px" p={0} _hover={{ bg: 'transparent' }}>
              <Icon as={ChevronLeftIcon} color="#15112B80" boxSize="24px" />
            </Button>
            <HStack spacing={2} align="center">
              <Image src="/pdf.svg" alt="PDF Icon" width={24} height={24} style={{ objectFit: 'contain' }} />
              <Text fontSize="24px" color="#6E6B7B" fontWeight="600" style={{ fontFamily: 'var(--font-inter)' }}>
                {metadata?.topic || 'Untitled Topic'}
              </Text>
            </HStack>
          </HStack>
        </Box>
      </Box>

      <Box flex="1" position="relative" overflow="hidden">
        <Container maxW="4xl" px={4} pt={4} position="relative" height="100%" overflow="hidden">
          <Box position="relative" height="100%" overflow="hidden">
            <Box
              height="100%"
              overflowY="auto"
              pr={4}
              pb={{ base: "120px", md: 0 }}
              css={{ '&::-webkit-scrollbar': { width: '8px' } }}
            >
              <Box ref={resultCardRef} bg="white" borderRadius="12px" p="20px" border="1px solid" borderColor="#41414114" position="relative" overflow="hidden">
                {isGoodScore && (
                  <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0}>
                    <ClientOnly>
                                          <ReactConfetti
                      width={cardSize.width}
                      height={cardSize.height}
                      numberOfPieces={200}
                      recycle={true}
                      gravity={0.1}
                      friction={0.99}
                      initialVelocityX={4}
                      initialVelocityY={10}
                      colors={['#46CD94', '#6D56FA', '#FF6258', '#FFD93D']}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                      }}
                    />
                    </ClientOnly>
                  </Box>
                )}
                <Box position="relative" zIndex={1}>
                  <Box textAlign="center">
                    {isGoodScore && (
                      <Box mb={4} display="flex" justifyContent="center">
                        <Image src="/correctanswer.svg" alt="Success Icon" width={48} height={48} />
                      </Box>
                    )}
                    <Text fontSize="24px" color="#3E3C46" fontWeight="600" mb={4} style={{ fontFamily: 'var(--font-inter)' }}>
                      {isGoodScore ? `Great Work ${userName}, you did very good on your quiz.` : `Keep practicing ${userName}, you can do better!`}
                    </Text>
                    <Text fontSize="36px" color="#3E3C46" fontWeight="700" style={{ fontFamily: 'var(--font-inter)' }}>
                      {score}
                    </Text>
                    <Box mt={6} width="100%" maxW="400px" mx="auto">
                      <HStack spacing={1} width="100%" height="12px" position="relative">
                        <Box height="100%" width={`${(correctAnswers / totalQuestions) * 100}%`} bg="#46CD94" borderRadius="4px" transition="width 0.5s ease-in-out" />
                        <Box height="100%" width={`${((totalQuestions - correctAnswers) / totalQuestions) * 100}%`} bg="#FF6258" borderRadius="4px" transition="width 0.5s ease-in-out" />
                      </HStack>
                      <HStack spacing={8} mt={4} mb={6} justify="center">
                        <HStack spacing={2}>
                          <Box width="16px" height="16px" borderRadius="full" bg="#46CD94" />
                          <Text fontSize="14px" color="#3E3C46">Answered Correctly</Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Box width="16px" height="16px" borderRadius="full" bg="#FF6258" />
                          <Text fontSize="14px" color="#3E3C46">Missed Answers</Text>
                        </HStack>
                      </HStack>
                      <Button
                        mt={6}
                        onClick={handleShare}
                        isLoading={isGeneratingImage}
                        loadingText="Generating image..."
                        bg="#6D56FA"
                        color="white"
                        _hover={{ bg: "#5842E8" }}
                        _active={{ bg: "#4935D1" }}
                        px="24px"
                        py="10px"
                        mx="auto"
                        borderRadius="12px"
                        fontSize="14px"
                        fontWeight="500"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        gap="2"
                      >
                        Share Results
                        <ExternalLinkIcon boxSize="14px" />
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box mt={8}>
                <Text fontSize="20px" color="#3E3C46" fontWeight="600" mb={4}>Result Summary</Text>
                <Accordion allowToggle index={expandedIndex} onChange={(index) => setExpandedIndex(Array.isArray(index) ? index[0] : index)}>
                  {questions.map((question, index) => (
                    <AccordionItem key={index} border="none" mb={2}>
                      {({ isExpanded }) => (
                        <>
                          <Box bg="white" borderRadius={isExpanded ? "12px 12px 0 0" : "12px"} p="20px" border="1px solid" borderColor="#3E3C461F" borderBottom={isExpanded ? "none" : "1px solid #3E3C461F"}>
                            <AccordionButton p={0} _hover={{ bg: 'transparent' }}>
                              <VStack spacing={4} align="stretch" width="100%">
                                <HStack justify="space-between" width="100%">
                                  <Text fontSize="16px" color="#3E3C46" fontWeight="500">Question {index + 1}</Text>
                                  <Box px={3} py={1} borderRadius="8px" bg={userAnswers[index] === question.correct_index ? "#ECFDF3" : "#FF505014"} border="1px solid" borderColor={userAnswers[index] === question.correct_index ? "#ABEFC6" : "#FF625880"}>
                                    <Text fontSize="14px" color={userAnswers[index] === question.correct_index ? "#009758" : "#FF5050"} fontWeight="500">
                                      {userAnswers[index] === question.correct_index ? "Correct Answer" : "Wrong Answer"}
                                    </Text>
                                  </Box>
                                </HStack>
                                {!isExpanded && (
                                  <>
                                    <Box height="1px" bg="#0000001A" width="100%" />
                                    <Text fontSize="16px" color="#3E3C46" fontWeight="400" textAlign="left" width="100%">
                                      {question.question}
                                    </Text>
                                  </>
                                )}
                              </VStack>
                            </AccordionButton>
                          </Box>
                          <Box bg="white" borderRadius="0 0 12px 12px" border="1px solid" borderColor="#3E3C461F" borderTop="none">
                            <AccordionPanel pt={4} pb={4} px={5}>
                              <VStack spacing={6} align="stretch">
                                <Box bg="#98989814" borderRadius="12px" border="1px solid" borderColor="#D9D9D91F" p={4}>
                                  <Text fontSize="16px" color="#3E3C46" fontWeight="400">{question.question}</Text>
                                </Box>
                                {question.options.map((option, optionIndex) => (
                                  <Box key={optionIndex} bg={optionIndex === question.correct_index ? "#ECFDF3" : userAnswers[index] === optionIndex ? "#FF505014" : "#F8F8F9"} borderRadius="8px" p={4} display="flex" alignItems="center">
                                    <Box
                                      w="20px"
                                      h="20px"
                                      borderRadius="full"
                                      border="2px solid"
                                      borderColor={optionIndex === question.correct_index ? "#009758" : userAnswers[index] === optionIndex ? "#FF5050" : "#D9D9D9"}
                                      mr={3}
                                      position="relative"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                    >
                                      {(userAnswers[index] === optionIndex || optionIndex === question.correct_index) && (
                                        <Box w="10px" h="10px" borderRadius="full" bg={optionIndex === question.correct_index ? "#009758" : "#FF5050"} />
                                      )}
                                    </Box>
                                    <HStack justify="space-between" width="100%">
                                      <Text fontSize="16px" color="#3E3C46">{option}</Text>
                                      {(userAnswers[index] === optionIndex || optionIndex === question.correct_index) && (
                                        <Text fontSize="14px" color={optionIndex === question.correct_index ? "#009758" : "#FF5050"} fontWeight="500">
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
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
