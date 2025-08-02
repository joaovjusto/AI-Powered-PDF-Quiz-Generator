'use client'
import { useQuizStore } from '@/store/quiz'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Question } from '@/components/Question'
import Image from 'next/image'
import {
  Box,
  Container,
  Heading,
  Button,
  HStack,
  Icon,
  VStack,
  Stack,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { useScrollSync } from 'react-use-scroll-sync'

export default function EditPage() {
  const { questions, metadata, isProcessing } = useQuizStore()
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!questions?.length && !isProcessing) {
      router.push('/')
    }
  }, [questions, isProcessing, router])

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

  if (isProcessing) {
    return null
  }

  if (!questions?.length) {
    return null
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
      {/* Header com botão Back e título */}
      <Box w="full" flexShrink={0}>
        {/* Container para alinhar o botão Back com o conteúdo */}
        <Container maxW="4xl" px={4} py={4}>
          <Button
            leftIcon={<Icon as={ChevronLeftIcon} color="#6D56FA" boxSize={6} />}
            variant="ghost"
            color="#6D56FA"
            onClick={() => router.push('/')}
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
        
        {/* Título com logo - Responsivo */}
        <Container maxW="4xl" mb={8}>
          <Stack 
            spacing={3} 
            alignItems="center"
            direction={{ base: 'column', md: 'row' }}
          >
            <Image
              src="/logo.svg"
              alt="Logo"
              width={31}
              height={29}
              style={{ objectFit: 'contain' }}
            />
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

      {/* Conteúdo principal com scroll */}
      <Box flex="1" overflow="hidden">
        <Container 
          ref={containerRef}
          maxW="4xl" 
          h="full"
          overflowY="auto"
          position="relative"
          pr={3}
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
              {/* Lista de questões */}
              {questions.map((question, index) => (
                <Question
                  key={index}
                  number={index + 1}
                  question={question.question}
                  options={question.options}
                  correctIndex={question.correct_index}
                />
              ))}

              {/* Botão Start Quiz */}
              <Button
                size="lg"
                colorScheme="purple"
                bg="brand.purple"
                w="full"
                maxW="200px"
                mx="auto"
                mt={8}
                mb={8}
              >
                Start Quiz
              </Button>
            </VStack>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}