'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  useToast,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { Question } from '@/components/Question'
import { useQuizStore } from '@/store/quiz'
import { LoadingQuizScreen } from '@/components/LoadingQuizScreen'

export default function EditPage() {
  const router = useRouter()
  const toast = useToast()
  const { questions = [], metadata, loadCachedQuiz, cacheCurrentQuiz, clearCache } = useQuizStore()
  const [isStarting, setIsStarting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const mainContainerRef = useRef<HTMLDivElement>(null)
  const scrollableContainerRef = useRef<HTMLDivElement>(null)

  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    let isMounted = true;

    const checkAndLoad = async () => {
      try {
        // Only check if we don't have questions yet
        if (isMounted && (!questions || questions.length === 0)) {
          const loaded = await loadCachedQuiz()
          if (!loaded) {
            console.log('No cached quiz found, redirecting to home')
            router.push('/')
            return
          }
          console.log('Cached quiz loaded successfully')
          if (isMounted) {
            toast({
              title: 'Previous Session Restored',
              description: 'Your quiz has been loaded from your last session.',
              status: 'success',
              duration: 3000,
              isClosable: true,
              position: 'top-right',
            })
          }
        }
      } catch (error) {
        console.error('Error loading cached quiz:', error)
        if (isMounted) {
          toast({
            title: 'Error Loading Session',
            description: 'Failed to load your previous session. Starting new quiz.',
            status: 'error',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          })
          router.push('/')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    checkAndLoad()

    return () => {
      isMounted = false
    }
  }, []) // Empty dependency array since we only want this to run once

  const handleBack = async () => {
    try {
      await clearCache()
      toast({
        title: 'Session Cleared',
        description: 'Your quiz session has been cleared.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      router.push('/')
    } catch (error) {
      console.error('Error clearing quiz session:', error)
      toast({
        title: 'Error',
        description: 'Failed to clear quiz session.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
    }
  }

  const handleStartQuiz = async () => {
    setIsStarting(true)
    try {
      const cachePromise = cacheCurrentQuiz()
      const minDelayPromise = new Promise(resolve => setTimeout(resolve, 3000))

      await Promise.all([cachePromise, minDelayPromise])
      
      toast({
        title: 'Quiz Ready',
        description: 'Your quiz has been prepared for practice.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
      
      router.push('/practice')
    } catch (error) {
      console.error('Failed to cache quiz:', error)
      toast({
        title: 'Error',
        description: 'Failed to prepare quiz for practice.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      })
      setIsStarting(false)
    }
  }

  if (isStarting) {
    return <LoadingQuizScreen />
  }

  if (isLoading || !questions || questions.length === 0) {
    return null
  }

  return (
    <Box w="full" display="flex" flexDirection="column" minH="100vh" bg="#F8F8F9">
      {/* Header */}
      <Box w="full" bg="#F8F8F9">
        {/* Back Button Container - Separado do conteúdo principal */}
        {isMobile ? (
          <Container maxW="4xl" px={4}>
            <Box py={4}>
              <Button
                leftIcon={<Icon as={ChevronLeftIcon} color="#6D56FA" boxSize={6} />}
                variant="ghost"
                onClick={handleBack}
                ml={0}
                pl={0}
                fontSize="14px"
                fontWeight="600"
                color="#6D56FA"
                _hover={{ bg: 'transparent' }}
                style={{ fontFamily: 'var(--font-inter)' }}
              >
                Back
              </Button>
            </Box>
          </Container>
        ) : (
          <Box py={4} pl={8}>
            <Button
              leftIcon={<Icon as={ChevronLeftIcon} color="#6D56FA" boxSize={6} />}
              variant="ghost"
              onClick={handleBack}
              fontSize="14px"
              fontWeight="600"
              color="#6D56FA"
              _hover={{ bg: 'transparent' }}
              style={{ fontFamily: 'var(--font-inter)' }}
              pl={0}
              ml={0}
            >
              Back
            </Button>
          </Box>
        )}

        {/* Title with logo - Em um Container separado */}
        <Container maxW="4xl" px={4}>
          <Box py={8}>
            <Stack
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: 4, md: 3 }}
              alignItems="center"
              justifyContent={{ base: 'center', md: 'flex-start' }}
              textAlign={{ base: 'center', md: 'left' }}
            >
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
                Review & Edit Questions
              </Heading>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box flex="1" position="relative">
        <Container
          maxW="4xl"
          px={4}
          position="relative"
          height="calc(100vh - 200px)"
          overflow="hidden"
        >
          {/* Scrollable Content */}
          <Box
            ref={scrollableContainerRef}
            overflowY="auto"
            height="100%"
            pb="200px"
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
              background: 'linear-gradient(to left, #FFFFFF 16px, transparent 16px)',
              backgroundAttachment: 'local',
            }}
          >
            <VStack spacing={4} align="stretch" pt={8}>
              {questions.map((q, index) => (
                <Question
                  key={index}
                  number={index + 1}
                  question={q.question}
                  options={q.options}
                  correctIndex={q.correct_index}
                />
              ))}
            </VStack>
          </Box>

          {/* Fade Out Effect */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            height="200px"
            pointerEvents="none"
            background="linear-gradient(to bottom, rgba(248, 248, 249, 0) 0%, rgba(248, 248, 249, 0.8) 40%, rgba(248, 248, 249, 0.95) 70%, rgba(248, 248, 249, 1) 100%)"
            zIndex={1}
          />

          {/* Start Quiz Button */}
          <Box
            position="absolute"
            bottom="40px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={2}
            width="auto"
            textAlign="center"
          >
            <Button
              size="lg"
              bg="#6D56FA"
              color="white"
              borderRadius="12px"
              fontSize="16px"
              height="50px"
              px="32px"
              fontWeight="500"
              _hover={{ bg: '#5842E8' }}
              onClick={handleStartQuiz}
              style={{ fontFamily: 'var(--font-inter)' }}
            >
              Start Quiz
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}