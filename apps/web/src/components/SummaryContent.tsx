'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Box,
  Container,
  Button,
  Icon,
  HStack,
  Text,
} from '@chakra-ui/react'
import { ChevronLeftIcon } from '@chakra-ui/icons'
import { useQuizStore } from '@/store/quiz'

export function SummaryContent() {
  const router = useRouter()
  const { metadata, userName } = useQuizStore()

  const handleBack = () => {
    router.push('/practice')
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
              {/* Empty content area for future implementation */}
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