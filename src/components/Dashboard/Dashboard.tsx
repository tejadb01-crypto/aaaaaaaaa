import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { CandidateCard } from './CandidateCard';
import { CandidateModal } from './Modal';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Search, Users, TrendingUp, Clock } from 'lucide-react';
import { Candidate } from '../../store/candidateSlice';

type SortField = 'name' | 'score' | 'date';
type SortOrder = 'asc' | 'desc';

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const { candidates } = useSelector((state: RootState) => state.candidate);
  const { questions } = useSelector((state: RootState) => state.interview);

  const stats = useMemo(() => {
    const total = candidates.length;
    const completed = candidates.filter(c => c.status === 'completed').length;
    const avgScore = completed > 0 
      ? candidates
          .filter(c => c.status === 'completed')
          .reduce((sum, c) => sum + c.finalScore, 0) / completed
      : 0;

    return {
      total,
      completed,
      avgScore: Math.round(avgScore * 10) / 10,
      inProgress: candidates.filter(c => c.status === 'in_progress').length,
    };
  }, [candidates]);

  const filteredAndSortedCandidates = useMemo(() => {
    let filtered = candidates.filter(candidate =>
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'score':
          comparison = a.finalScore - b.finalScore;
          break;
        case 'date':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [candidates, searchTerm, sortField, sortOrder]);

  const handleCandidateClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Score</p>
                <p className="text-2xl font-bold">{stats.avgScore}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Sort */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={sortField === 'name' ? 'default' : 'outline'}
                onClick={() => handleSort('name')}
                size="sm"
              >
                Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                variant={sortField === 'score' ? 'default' : 'outline'}
                onClick={() => handleSort('score')}
                size="sm"
              >
                Score {sortField === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button
                variant={sortField === 'date' ? 'default' : 'outline'}
                onClick={() => handleSort('date')}
                size="sm"
              >
                Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            </div>
          </div>

          {/* Candidates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onClick={() => handleCandidateClick(candidate)}
              />
            ))}
          </div>

          {filteredAndSortedCandidates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {candidates.length === 0 ? 'No candidates yet.' : 'No candidates match your search.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Detail Modal */}
      <CandidateModal
        candidate={selectedCandidate}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCandidate(null);
        }}
        interviewData={{ questions }}
      />
    </div>
  );
}