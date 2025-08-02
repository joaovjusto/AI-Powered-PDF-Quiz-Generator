'use client'
import { useQuizStore } from '@/store/quiz'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Question } from '@/components/Question'
import { LoadingQuizScreen } from '@/components/LoadingQuizScreen'
import Image from 'next/image'
import {
  Box,
  Container,
  Heading,
  Button,
  Icon,
  VStack,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'

export default function EditPage() {
  const { 
    questions, 
    metadata, 
    isProcessing, 
    cacheCurrentQuiz,
    loadCachedQuiz,
    clearCache 
  } = useQuizStore()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)
  const isMobile = useBreakpointValue({ base: true, md: false })
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    const checkCache = async () => {
      if (!questions?.length && !isProcessing) {
        const hasCachedQuiz = await loadCachedQuiz()
        if (!hasCachedQuiz) {
          router.push('/')
        }
      }
    }
    
    checkCache()
  }, [questions, isProcessing, loadCachedQuiz, router])

  useEffect(() => {
    const container = containerRef.current
    const main = mainRef.current

    if (!container || !main) return

    const handleScroll = (e: WheelEvent) => {
      if (e.target instanceof Node && container.contains(e.target)) {
        return
      }
      container.scrollTop += e.deltaY
    }

    main.addEventListener('wheel', handleScroll)

    return () => {
      main.removeEventListener('wheel', handleScroll)
    }
  }, [])

  const handleBack = async () => {
    await clearCache()
    router.push('/')
  }

  const handleStartQuiz = async () => {
    setIsStarting(true)
    await cacheCurrentQuiz()
  }

  if (isProcessing) {
    return null
  }

  if (!questions?.length) {
    return null
  }

  if (isStarting) {
    return <LoadingQuizScreen />
  }

  return (
    <Box 
      ref={mainRef}
      w="full" 
      h="100vh" 
      display="flex" 
      flexDirection="column" 
      overflow="hidden"
    >
      {/* Header with Back button and title */}
      <Box w="full" flexShrink={0}>
        {isMobile ? (
          // Mobile version - Button aligned with container
          <Container maxW="4xl" px={4} py={4}>
            <Button
              leftIcon={<Icon as={ChevronLeftIcon} color="#6D56FA" boxSize={6} />}
              variant="ghost"
              color="#6D56FA"
              onClick={handleBack}
              pl={0}
              ml={0}
              fontSize="14px"
              fontWeight="600"
              style={{ fontFamily: 'var(--font-inter)' }}
              _hover={{ bg: 'transparent' }}
              gap={0}
            >
              Back
            </Button>
          </Container>
        ) : (
          // Desktop version - Original layout
          <Box px={4} py={4} ml={6}>
            <Button
              leftIcon={<Icon as={ChevronLeftIcon} color="#6D56FA" boxSize={6} />}
              variant="ghost"
              color="#6D56FA"
              onClick={handleBack}
              pl={0}
              ml={0}
              fontSize="14px"
              fontWeight="600"
              style={{ fontFamily: 'var(--font-inter)' }}
              _hover={{ bg: 'transparent' }}
              gap={0}
            >
              Back
            </Button>
          </Box>
        )}
        
        {/* Title with logo - Responsive */}
        <Container maxW="4xl" mb={8}>
          <Stack 
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: 4, md: 3 }}
            alignItems="center"
            width="100%"
            justifyContent={{ base: 'center', md: 'flex-start' }}
          >
            <Box textAlign={{ base: 'center', md: 'left' }}>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={31}
                height={29}
                style={{ objectFit: 'contain', margin: '0 auto' }}
              />
            </Box>
            <Heading 
              fontSize={{ base: "24px", md: "32px" }}
              fontWeight="500"
              color="#3E3C46"
              style={{ fontFamily: 'var(--font-inter)' }}
              textAlign={{ base: "center", md: "left" }}
            >
              Review & Edit Questions
            </Heading>
          </Stack>
        </Container>
      </Box>

      {/* Main content with scroll */}
      <Box flex="1" overflow="hidden" position="relative">
        {/* Fade out effect at the bottom */}
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          height="200px"
          pointerEvents="none"
          zIndex="1"
          background="linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 40%, rgba(255, 255, 255, 0.95) 70%, rgba(255, 255, 255, 1) 100%)"
        />

        {/* Fixed Start Quiz Button */}
        <Box
          position="absolute"
          bottom="40px"
          left="0"
          right="0"
          display="flex"
          justifyContent="center"
          zIndex="2"
        >
          <Button
            size="lg"
            bg="#6D56FA"
            color="white"
            fontSize="16px"
            height="50px"
            px="32px"
            _hover={{ bg: '#5842E8' }}
            onClick={handleStartQuiz}
          >
            Start Quiz
          </Button>
        </Box>
        
        <Container 
          ref={containerRef}
          maxW="4xl" 
          h="full"
          overflowY="auto"
          position="relative"
          pr={3}
          pb="200px"
          css={{
            '&::-webkit-scrollbar-track': {
              background: '#FFFFFF',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#F5F5F5',
              borderRadius: '10px',
              border: '2px solid #FFFFFF',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#000',
              borderRadius: '10px',
              border: '2px solid #FFFFFF',
            },
            '&::-webkit-scrollbar-thumb:vertical': {
              minHeight: '50px',
            },
            '&::-webkit-scrollbar-corner': {
              background: '#FFFFFF',
            },
            scrollbarWidth: 'auto',
            scrollbarColor: '#F5F5F5 #FFFFFF',
            msOverflowStyle: 'none',
            backgroundAttachment: 'local',
          }}
        >
          <Box pr={2}>
            <VStack align="stretch" spacing={4}>
              {/* Questions list */}
              {questions.map((question, index) => (
                <Question
                  key={index}
                  number={index + 1}
                  question={question.question}
                  options={question.options}
                  correctIndex={question.correct_index}
                />
              ))}
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}